'use strict';

process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert');
const { GraphRepository } = require('../src/repositories/graphRepository');
const { GraphService } = require('../src/services/graphService');
const { ValidationError } = require('../src/models/graph');

function makeService() {
  return new GraphService(new GraphRepository());
}

test('creates and lists a graph', () => {
  const service = makeService();
  const g = service.create({ name: 'demo', nodes: ['a', 'b'], edges: [['a', 'b']] });
  assert.ok(g.id);
  assert.deepStrictEqual(service.list(), [{ id: g.id, name: 'demo', nodeCount: 2, edgeCount: 1 }]);
});

test('rejects edges to unknown nodes', () => {
  assert.throws(
    () => makeService().create({ name: 'bad', nodes: ['a'], edges: [['a', 'z']] }),
    ValidationError,
  );
});

test('finds the shortest path', () => {
  const service = makeService();
  const g = service.create({
    name: 'paths',
    nodes: ['a', 'b', 'c', 'd'],
    edges: [['a', 'b'], ['b', 'c'], ['a', 'c'], ['c', 'd']],
  });
  assert.deepStrictEqual(service.shortestPath(g.id, 'a', 'd'), ['a', 'c', 'd']);
  assert.strictEqual(service.shortestPath(g.id, 'd', 'a'), null);
});
