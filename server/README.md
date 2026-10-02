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
4. Set `JWT_SECRET` in `server/.env` to any long random string (used to sign login sessions) — e.g. generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

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

| Variable         | Required | Default                 | Description                                        |
| ---------------- | -------- | ------------------------ | --------------------------------------------------- |
| `PORT`           | No       | `4000`                   | Port the Express server listens on                   |
| `MONGODB_URI`    | **Yes**  | —                         | MongoDB connection string                            |
| `CLIENT_ORIGIN`  | No       | `http://localhost:5173`  | Allowed CORS origin for the frontend                 |
| `JWT_SECRET`     | **Yes**  | —                         | Secret used to sign/verify login session tokens       |
| `JWT_EXPIRES_IN` | No       | `7d`                      | How long a login session stays valid                  |

## Authentication

Every `/api/todos/*` route requires a valid session: sign up or log in via the `/api/auth` endpoints below to get a JWT, then send it as `Authorization: Bearer <token>` on every todo request. Each todo is tied to the user who created it (`userId`) — one user can never see, edit, or delete another user's todos; a request for someone else's todo returns a `404` (not `403`), so existence isn't leaked. Passwords are hashed with bcrypt and never stored or returned in plaintext.

## API reference

All responses are JSON. Errors use the shape `{ "error": { "message": string, "details"?: [...] } }`.

### Auth (`/api/auth`) — public except `/me`

| Method | Endpoint             | Body                       | Success               | Notes                                       |
| ------ | --------------------- | --------------------------- | ---------------------- | -------------------------------------------- |
| POST   | `/api/auth/register`  | `{ username, password }`    | `201` + `{user, token}` | username 3-30 chars, password 8-72 chars; `400` if taken/invalid |
| POST   | `/api/auth/login`     | `{ username, password }`    | `200` + `{user, token}` | `401` generic message for bad username **or** bad password |
| GET    | `/api/auth/me`        | — (Bearer token)             | `200` + `{user}`        | `401` if missing/invalid/expired token       |

### Todos (`/api/todos`) — all require `Authorization: Bearer <token>`

| Method | Endpoint             | Body                                      | Success        | Notes                                   |
| ------ | --------------------- | ------------------------------------------ | -------------- | ----------------------------------------|
| GET    | `/api/todos`           | —                                           | `200` + array   | Newest first, scoped to the current user |
| POST   | `/api/todos`           | `{ title, description? }`                   | `201` + todo    | `400` if title missing/too long          |
| PUT    | `/api/todos/:id`       | `{ title, description? }`                   | `200` + todo    | `400` invalid id/body, `404` not found or not yours |
| PATCH  | `/api/todos/:id/done`  | —                                           | `200` + todo    | Flips `done`; `404` if not found or not yours |
| DELETE | `/api/todos/:id`       | —                                           | `204`           | `404` if not found or not yours          |

Todo shape:
```json
{
  "_id": "string",
  "userId": "string",
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

Uses `mongodb-memory-server` to spin up a throwaway in-memory MongoDB instance for each test run — no real database connection or `MONGODB_URI` is needed to run the tests (a placeholder `JWT_SECRET` is set the same way). **Note:** the first run needs internet access once, to download and cache the `mongod` binary (~600MB); subsequent runs use the cached binary and are fast. The suite includes a dedicated cross-user isolation test proving one user's todo is completely inaccessible (404, untouched) to another authenticated user.

## Assumptions / limitations

- Username/password auth with JWT bearer tokens (no OAuth/social login); each user's todos are private to them.
- Login sessions last 7 days and aren't revocable server-side before then — logging out only clears the token client-side.
- No password reset/email verification flow, and no rate-limiting on login/register attempts.
- No pagination, filtering, or sorting beyond "newest first".
- No soft-delete — `DELETE` permanently removes the document.
- CORS is restricted to a single configured origin (`CLIENT_ORIGIN`) rather than a wildcard.
- Todos created before this auth update (if any) have no owner and are no longer reachable by any user.
