## Quick context for AI code assistance

- Project type: Node.js + Express (ES modules) + MongoDB (Mongoose).
- Repo root for this service: `server/` (package.json, `src/`).
- Entrypoints: `src/app.js` (Express app) and `src/server.js` (boots app and calls `connectDB`).

## High-level architecture

- HTTP server: `src/app.js` sets up middleware, rate limiter, logging and mounts routers.
- Routes live in `src/routers/` and map to controllers in `src/controllers/`.
- Data layer: Mongoose models in `src/models/` (example: `userModel.js`).
- DB connection: `src/config/db.config.js` exposes `connectDB()` and uses `src/secret.js` for `mongoURI`.

Key files to reference when modifying behavior:
- `src/app.js` — middleware ordering, rate limiter config (1 minute, max 5), error handlers.
- `src/server.js` — listens on `serverPort` and invokes `connectDB()`.
- `src/controllers/seedController.js` — seed endpoint implementation; uses `src/data.js`.
- `src/models/userModel.js` — user schema (note: password hashing is done in schema `set`).
- `src/routers/*` — routers are mounted under `/api/*` (e.g. `/api/users`, `/api/seed`).

## Environment & run commands
- This service is located in `server/`. Typical local workflow:

```bash
cd server
npm install
npm run dev   # starts nodemon on ./src/server.js
```

- Environment variables read from `.env` via `dotenv` (see `src/secret.js`):
  - `MONGO_URI` — MongoDB connection string
  - `SERVER_PORT` — optional port (defaults in code to 4000)

Note: `src/server.js` uses `serverPort` but the console log currently prints `server running on port 3001` — the logged port is stale; prefer `serverPort` in messages when editing.

## Project-specific patterns and conventions
- ES modules only — use `import` / `export default` consistently. Files set `type: "module"` in `package.json`.
- Controllers follow this pattern:
  - Accept `(req, res, next)`
  - Use `try/catch` and call `next(error)` for error handling (error middleware in `app.js` handles responses).
  - Example: `src/controllers/userController.js` performs search, pagination and returns `res.status(200).json({...})`.
- Model-level behavior: password hashing occurs via a Mongoose `set` on the `password` field in `userModel.js`. When seeding or creating users, assign plain password and allow the model to hash it.
- Sensitive fields: controllers often exclude `password` with projection (example: `const option = { password: 0 }` in `userController.js`). Follow that pattern when returning user docs.
- Seeding: `GET /api/seed/users` triggers `seedController.seedUser` which `deleteMany()` then `insertMany(data.users)`; passwords are hashed by the schema setter.

## Error handling and HTTP conventions
- Use `http-errors` (`createHttpError`) for consistent typed errors (see `userController.js`).
- The global error middleware in `src/app.js` returns `{ success:false, message: err.message }`.

## Common edits & where to make them
- Add new API routes: create router in `src/routers/`, create controller in `src/controllers/`, import and mount the router in `src/app.js` under `/api/...`.
- Add models: `src/models/` with Mongoose schemas; follow `userModel.js` for validators, defaults and `timestamps: true`.
- DB changes: update `src/config/db.config.js` and ensure `mongoURI` in `src/secret.js` picks up env var.

## Small pitfalls observed (useful for AI to watch for)
- `src/app.js` uses `body-parser` even though Express can parse JSON natively — preserve existing middlewares unless refactoring intentionally.
- Rate limiter: configured to 5 requests/min — avoid tests or scripts that accidentally trigger it.
- `responseController.js` currently exists but is empty — check for references before removing.

## Example tasks — how to implement them here
- Add GET /api/users/:id
  - router: add `userRouter.get('/:id', getUserById)` in `src/routers/userRouter.js`
  - controller: implement `getUserById(req,res,next)` in `src/controllers/userController.js` using `User.findById(id, { password:0 })` and `createHttpError(404, 'User not found')`.

## Where to look for more context
- `server/package.json` — scripts and dependencies (nodemon, express, mongoose). Use that for run/dev commands.
- `src/readme.md` — project-level notes / course plan.

If anything is unclear or you'd like a different tone (more prescriptive vs. more conservative changes), tell me what to emphasize and I'll iterate.
