'use strict';

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validates and normalises a graph payload: { name, nodes: [id], edges: [[from, to]] }.
 */
function createGraph({ name, nodes = [], edges = [] }) {
  if (typeof name !== 'string' || name.trim() === '') {
    throw new ValidationError('Graph "name" must be a non-empty string');
  }
  const nodeSet = new Set(nodes.map(String));
  for (const edge of edges) {
    if (!Array.isArray(edge) || edge.length !== 2) {
      throw new ValidationError('Each edge must be a [from, to] pair');
    }
    const [from, to] = edge.map(String);
    if (!nodeSet.has(from) || !nodeSet.has(to)) {
      throw new ValidationError(`Edge ${from}->${to} references an unknown node`);
    }
  }
  return {
    name: name.trim(),
    nodes: [...nodeSet],
    edges: edges.map(([f, t]) => [String(f), String(t)]),
  };
}

module.exports = { createGraph, ValidationError };
