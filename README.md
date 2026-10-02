# TODO App

A full-stack TODO app built as a take-home assignment: React (Vite + TypeScript + Tailwind CSS) on the frontend, Express (TypeScript) + MongoDB (Mongoose) on the backend, wired together with TanStack React Query for data fetching and optimistic updates.

## Tech stack

| Layer     | Choice                                                            |
| --------- | ------------------------------------------------------------------ |
| Frontend  | React 18, Vite, TypeScript, Tailwind CSS, TanStack React Query, react-hot-toast |
| Backend   | Node.js, Express, TypeScript, Mongoose, express-validator, JWT auth (jsonwebtoken + bcryptjs) |
| Database  | MongoDB (MongoDB Atlas recommended)                                 |
| Testing   | Jest + Supertest + mongodb-memory-server (backend API tests)        |
| Tooling   | npm workspaces monorepo (`client/`, `server/`)                      |

## Project structure

```
type_b_digital_assesment/
├── client/        # React frontend — see client/README.md
├── server/        # Express backend — see server/README.md
└── package.json   # npm workspaces root (installs + runs both)
```

## Quick start

1. **Install everything** (installs both workspaces from the root):
   ```bash
   npm install
   ```
2. **Configure environment variables**:
   - `cp server/.env.example server/.env` and fill in your `MONGODB_URI` (see [server/README.md](server/README.md) for MongoDB Atlas setup notes) and a `JWT_SECRET` (any long random string — used to sign login sessions).
   - `cp client/.env.example client/.env` (defaults already point at `http://localhost:4000/api`, which matches the backend's default port).
3. **Run both apps together**:
   ```bash
   npm run dev
   ```
   This starts the backend on `http://localhost:4000` and the frontend on `http://localhost:5173` concurrently.

## Scripts (run from the repo root)

| Script          | What it does                                         |
| --------------- | ----------------------------------------------------- |
| `npm run dev`   | Runs client + server dev servers concurrently          |
| `npm run build` | Type-checks and builds both workspaces for production  |
| `npm run test`  | Runs the backend Jest/Supertest suite                  |
| `npm run lint`  | Lints the client source                                 |

## Features

- Sign up / log in / log out — todos are private per account, enforced server-side
- View all TODOs
- Create a TODO (title required, description optional)
- Edit a TODO's title/description inline
- Toggle a TODO's done status (strikethrough + faded styling when complete)
- Delete a TODO
- Client + server form validation, friendly error messages (toasts + inline banners)
- Optimistic UI updates with automatic rollback on failure
- Loading skeletons, empty state, and retryable error state

## Assumptions / limitations

- Username/password auth via JWT bearer tokens; no OAuth/social login, password reset, or login rate-limiting.
- No pagination or filtering — all todos are fetched and rendered in one list.
- No soft-delete or undo — deletes are permanent.

See [client/README.md](client/README.md) and [server/README.md](server/README.md) for stack-specific setup details, further assumptions, and the full API reference.
