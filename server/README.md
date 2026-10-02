# TODO App — Backend

Express + TypeScript REST API backing the TODO app, persisting to MongoDB via Mongoose.

## Prerequisites

- Node.js 18+ (developed on v24)
- A MongoDB connection string — MongoDB Atlas (free tier) is recommended; a local MongoDB instance also works

## Setup

1. From the **repo root**, install dependencies (this installs all workspaces, including this one):
   ```bash
   npm install
   ```
2. Copy the env file and fill it in:
   ```bash
   cp server/.env.example server/.env
   ```
3. Set `MONGODB_URI` in `server/.env` (see "MongoDB connection notes" below).

## Running

From the repo root:
```bash
npm run dev --workspace=server    # dev server with auto-reload (tsx watch), or `npm run dev` to run client+server together
npm run build --workspace=server  # type-check + compile to server/dist
npm run start --workspace=server  # run the compiled build (after build)
npm run test --workspace=server   # run the Jest/Supertest suite
```

The API listens on `http://localhost:4000` by default (`PORT` in `.env`).

## MongoDB connection notes

### Option A: MongoDB Atlas (recommended)

1. Create a free account/cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. In **Database Access**, create a database user with a username/password.
3. In **Network Access**, add your current IP (or `0.0.0.0/0` for convenience during local development/review — not recommended for production).
4. In **Database → Connect → Drivers**, copy the connection string, which looks like:
   ```
   mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
   ```
5. Replace `<username>`, `<password>`, and `<database>` (e.g. `todo-app`) and paste the result into `MONGODB_URI` in `server/.env`.

### Option B: Local MongoDB

If you have MongoDB running locally (or via Docker, e.g. `docker run -p 27017:27017 mongo`), set:
```
MONGODB_URI=mongodb://localhost:27017/todo-app
```

The app validates `MONGODB_URI` at startup and fails fast with a clear error message if it's missing.

## Environment variables

| Variable       | Required | Default                 | Description                                   |
| -------------- | -------- | ------------------------ | ---------------------------------------------- |
| `PORT`         | No       | `4000`                   | Port the Express server listens on             |
| `MONGODB_URI`  | **Yes**  | —                         | MongoDB connection string                      |
| `CLIENT_ORIGIN`| No       | `http://localhost:5173`  | Allowed CORS origin for the frontend           |

## API reference

Base path: `/api/todos`. All responses are JSON. Errors use the shape `{ "error": { "message": string, "details"?: [...] } }`.

| Method | Endpoint             | Body                                      | Success        | Notes                                   |
| ------ | --------------------- | ------------------------------------------ | -------------- | ----------------------------------------|
| GET    | `/api/todos`           | —                                           | `200` + array   | Newest first                            |
| POST   | `/api/todos`           | `{ title, description? }`                   | `201` + todo    | `400` if title missing/too long          |
| PUT    | `/api/todos/:id`       | `{ title, description? }`                   | `200` + todo    | `400` invalid id/body, `404` not found   |
| PATCH  | `/api/todos/:id/done`  | —                                           | `200` + todo    | Flips `done`; `404` if not found         |
| DELETE | `/api/todos/:id`       | —                                           | `204`           | `404` if not found                       |

Todo shape:
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "done": false,
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

## Testing

```bash
npm run test --workspace=server
```

Uses `mongodb-memory-server` to spin up a throwaway in-memory MongoDB instance for each test run — no real database connection or `MONGODB_URI` is needed to run the tests. **Note:** the first run needs internet access once, to download and cache the `mongod` binary (~600MB); subsequent runs use the cached binary and are fast.

## Assumptions / limitations

- No authentication — all todos are globally visible/editable (matches the assignment's scope).
- No pagination, filtering, or sorting beyond "newest first".
- No soft-delete — `DELETE` permanently removes the document.
- CORS is restricted to a single configured origin (`CLIENT_ORIGIN`) rather than a wildcard.
