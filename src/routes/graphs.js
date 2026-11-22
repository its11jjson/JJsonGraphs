'use strict';

const { ValidationError } = require('../models/graph');

function sendJson(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new ValidationError('Request body must be valid JSON'));
      }
    });
    req.on('error', reject);
  });
}

/**
 * HTTP layer: maps /graphs routes onto GraphService calls.
 *   GET    /graphs
 *   POST   /graphs
 *   GET    /graphs/:id
 *   DELETE /graphs/:id
 *   GET    /graphs/:id/path?from=a&to=b
 */
function createGraphRouter(service) {
  return async function handle(req, res) {
    const url = new URL(req.url, 'http://localhost');
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] !== 'graphs') return false;

    try {
      if (parts.length === 1 && req.method === 'GET') {
        sendJson(res, 200, service.list());
      } else if (parts.length === 1 && req.method === 'POST') {
        sendJson(res, 201, service.create(await readJson(req)));
      } else if (parts.length === 2 && req.method === 'GET') {
        const graph = service.get(parts[1]);
        if (graph) sendJson(res, 200, graph);
        else sendJson(res, 404, { error: 'Not found' });
      } else if (parts.length === 2 && req.method === 'DELETE') {
        if (service.remove(parts[1])) sendJson(res, 204);
        else sendJson(res, 404, { error: 'Not found' });
      } else if (parts.length === 3 && parts[2] === 'path' && req.method === 'GET') {
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');
        sendJson(res, 200, { path: service.shortestPath(parts[1], from, to) });
      } else {
        sendJson(res, 405, { error: 'Method not allowed' });
      }
    } catch (err) {
      if (err instanceof ValidationError) sendJson(res, 400, { error: err.message });
      else throw err;
    }
    return true;
  };
}

module.exports = { createGraphRouter };
