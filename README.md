# JJsonGraphs

A small mock API for storing directed graphs and finding shortest paths. It exists to try out [Graphify](https://graphify.com) code-graph indexing.

## Architecture

Requests flow through four layers, wired together in `src/app.js`:

| Layer | File | Responsibility |
|---|---|---|
| HTTP routes | `src/routes/graphs.js` | Parses requests, maps `/graphs` endpoints to service calls, turns validation errors into 400s |
| Service | `src/services/graphService.js` | Business logic and the breadth-first shortest-path algorithm |
| Model | `src/models/graph.js` | Validates and normalises graph payloads |
| Repository | `src/repositories/graphRepository.js` | In-memory storage behind a swappable interface |

`src/server.js` starts the server, and `src/utils/logger.js` writes JSON log lines.

## API

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/graphs` | List graphs with node and edge counts |
| POST | `/graphs` | Create a graph: `{ "name": "...", "nodes": ["a", "b"], "edges": [["a", "b"]] }` |
| GET | `/graphs/:id` | Get one graph |
| DELETE | `/graphs/:id` | Delete a graph |
| GET | `/graphs/:id/path?from=a&to=b` | Shortest path between two nodes |

## Run

Requires Node.js 18 or later. There are no dependencies.

```
npm start
npm test
```

`npm start` listens on `PORT`, or 3000 by default.
