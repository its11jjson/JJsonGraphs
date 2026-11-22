'use strict';

const { randomUUID } = require('node:crypto');

/**
 * In-memory persistence layer. Swap for a database-backed implementation
 * with the same methods to change storage without touching the service.
 */
class GraphRepository {
  constructor() {
    this.graphs = new Map();
  }

  save(graph) {
    const id = graph.id || randomUUID();
    const record = { ...graph, id };
    this.graphs.set(id, record);
    return record;
  }

  findById(id) {
    return this.graphs.get(id) || null;
  }

  findAll() {
    return [...this.graphs.values()];
  }

  delete(id) {
    return this.graphs.delete(id);
  }
}

module.exports = { GraphRepository };
