'use strict';

const { createGraph } = require('../models/graph');
const logger = require('../utils/logger');

/**
 * Business logic: validation via the model, storage via the repository,
 * and graph algorithms (shortest path) on stored graphs.
 */
class GraphService {
  constructor(repository) {
    this.repository = repository;
  }

  create(payload) {
    const graph = createGraph(payload);
    const saved = this.repository.save(graph);
    logger.info('graph created', { id: saved.id, nodes: saved.nodes.length });
    return saved;
  }

  get(id) {
    return this.repository.findById(id);
  }

  list() {
    return this.repository.findAll().map(({ id, name, nodes, edges }) => ({
      id,
      name,
      nodeCount: nodes.length,
      edgeCount: edges.length,
    }));
  }

  remove(id) {
    return this.repository.delete(id);
  }

  /** Breadth-first shortest path on a directed graph; null if unreachable. */
  shortestPath(id, from, to) {
    const graph = this.repository.findById(id);
    if (!graph) return null;
    const adjacency = new Map(graph.nodes.map((n) => [n, []]));
    for (const [f, t] of graph.edges) adjacency.get(f).push(t);

    const previous = new Map([[from, null]]);
    const queue = [from];
    while (queue.length > 0) {
      const current = queue.shift();
      if (current === to) {
        const path = [];
        for (let n = to; n !== null; n = previous.get(n)) path.unshift(n);
        return path;
      }
      for (const next of adjacency.get(current) || []) {
        if (!previous.has(next)) {
          previous.set(next, current);
          queue.push(next);
        }
      }
    }
    return null;
  }
}

module.exports = { GraphService };
