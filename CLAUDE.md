# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start the Vite dev server (with HMR) on http://localhost:5173
- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint over the repo

There is no test runner configured.

## Architecture

A minimal single-page React 19 + Vite todo app. The entire UI lives in `src/App.jsx`; `src/main.jsx` mounts it under `<StrictMode>`.

- **State**: all client state is local `useState` in `App.jsx` — the todo list, the new-item input, loading/error flags, and the inline-edit state (`editingId` / `editingText`). There is no global store or router.
- **Data layer**: `src/api.js` is the only place that talks to the backend. It exposes `getTodos`, `createTodo`, `updateTodo`, `deleteTodo` against the `/todos` REST endpoint. Todos are identified by `_id` and carry a `content` string (MongoDB-style shape). The shared `request()` helper unwraps JSON, treats `204` as `null`, and rethrows server `{ error }` messages — so component-level `catch` blocks just surface `err.message`.
- **Backend**: not in this repo. By default it points at the deployed API via `VITE_API_BASE_URL` in `.env` (currently the cloudtype deployment, which sends `Access-Control-Allow-Origin: *`). `src/api.js` builds `BASE_URL` as `${VITE_API_BASE_URL ?? ''}/todos`, so if the env var is unset it falls back to the relative `/todos` path, which `vite.config.js` proxies (currently to the same cloudtype URL with `changeOrigin`) — useful if you run a local API instead. To switch backends, change `VITE_API_BASE_URL` in `.env` (and optionally the proxy target).
- **Styling**: plain CSS — `src/index.css` (global) and `src/App.css` (component). The UI text is in Korean.

Note: this directory is not its own git repository — it sits untracked inside the larger repo rooted at `/Users/youngjunlee/Project`.
