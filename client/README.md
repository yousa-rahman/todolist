# TODO App — Frontend

React + TypeScript + Vite single-page app for managing TODOs, talking to the Express backend over HTTP.

## Prerequisites

- Node.js 18+ (developed on v24)
- The backend running (see [../server/README.md](../server/README.md)) — or at least reachable at the URL configured below

## Setup

1. From the **repo root**, install dependencies (this installs all workspaces, including this one):
   ```bash
   npm install
   ```
2. Copy the env file:
   ```bash
   cp client/.env.example client/.env
   ```
   The default `VITE_API_URL=http://localhost:4000/api` matches the backend's default port — only change it if your backend runs elsewhere.

## Running

From the repo root:
```bash
npm run dev --workspace=client      # dev server at http://localhost:5173, or `npm run dev` to run client+server together
npm run build --workspace=client    # type-check + production build to client/dist
npm run preview --workspace=client  # preview the production build locally
npm run lint --workspace=client     # ESLint
```

## Features

- View all TODOs, newest first
- Add a TODO (title required, description optional) via the form at the top
- Edit a TODO's title/description inline (click **Edit**)
- Toggle done/undone via the circular checkbox — completed todos get a strikethrough and faded style
- Delete a TODO via the **Delete** button
- Client-side validation mirrors the backend's limits (title required, ≤200 chars; description ≤1000 chars)
- Optimistic updates: create/edit/toggle/delete all apply instantly in the UI and roll back automatically (with a toast explaining why) if the request fails
- Loading skeletons, an empty state, and a retryable error banner for the initial list fetch

## Environment variables

| Variable        | Required | Default                        | Description                  |
| ---------------- | -------- | -------------------------------- | ------------------------------|
| `VITE_API_URL`   | No       | `http://localhost:4000/api`      | Base URL of the backend API   |

## Assumptions / limitations

- No routing — the whole app is a single view.
- No authentication or multi-user support.
- No pagination — the entire todo list is fetched at once (fine for the scale of this assignment).
- No automated frontend test suite (out of scope for this submission — backend API tests cover the core logic; see [../server/README.md](../server/README.md)).
