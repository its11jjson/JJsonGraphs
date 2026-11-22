'use strict';

process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../src/app');

test('HTTP API round trip', async () => {
  const server = createApp().listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const created = await fetch(`${base}/graphs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'api', nodes: ['x', 'y'], edges: [['x', 'y']] }),
    });
    assert.strictEqual(created.status, 201);
    const { id } = await created.json();

    const path = await (await fetch(`${base}/graphs/${id}/path?from=x&to=y`)).json();
    assert.deepStrictEqual(path, { path: ['x', 'y'] });

    const bad = await fetch(`${base}/graphs`, { method: 'POST', body: '{"name":""}' });
    assert.strictEqual(bad.status, 400);
  } finally {
    server.close();
  }
});
