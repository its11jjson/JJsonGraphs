'use strict';

const http = require('node:http');
const { GraphRepository } = require('./repositories/graphRepository');
const { GraphService } = require('./services/graphService');
const { createGraphRouter } = require('./routes/graphs');
const logger = require('./utils/logger');

/** Composition root: wires repository -> service -> router into an HTTP server. */
function createApp({ repository = new GraphRepository() } = {}) {
  const service = new GraphService(repository);
  const graphRouter = createGraphRouter(service);

  return http.createServer(async (req, res) => {
    try {
      if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ status: 'ok' }));
      }
      const handled = await graphRouter(req, res);
      if (!handled) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found' }));
      }
    } catch (err) {
      logger.error('unhandled error', { message: err.message });
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error' }));
    }
  });
}

module.exports = { createApp };
