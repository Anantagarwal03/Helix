# Helix

Helix maps films as spoiler-aware story graphs. TMDB supplies movie metadata; Tavily finds plot sources and Groq drafts the graph for review before it is added to the library.

## Local setup

1. Use Node.js 25.7 or later (the server uses the built-in SQLite module), then install dependencies with `npm install` and `npm install --prefix server`.
2. Copy `.env.example` to `.env`. Add your TMDB, Groq, and Tavily keys there. Keep `.env` local; it is ignored by Git.
3. Start the frontend with `npm run dev`.
4. In another terminal, start the API server with `npm run dev:server`.

The frontend uses the API server at `http://127.0.0.1:5001` through the Vite `/api` proxy. Configure `HELIX_API_HOST`, `HELIX_API_PORT`, `HELIX_DB_PATH`, and `HELIX_CORS_ORIGINS` in the server environment when needed. The server binds to loopback by default and allows the local Vite origins listed in `.env.example`.

Open `/register` to create the first account using a Gmail, Yahoo, Outlook, Hotmail, Live, Rediffmail, iCloud, or Proton address. The server checks the address format and provider domain; it does not send a verification email. Passwords must be at least 10 characters. Sign-in creates a seven-day, HttpOnly, SameSite session cookie; cookies are marked Secure in production. Use `/login` for later sessions. Each account has a private library. Existing server JSON maps are assigned to the first account when it is created, and browser-local maps are imported during registration.

## Drafting a story map

In Library, search for a title and choose the correct TMDB result. Generate the story-map draft, review its beats, spoiler levels, connections, and source links, then approve it to add it to the library. Draft generation is limited to five requests per hour per client IP.

Story-map generation uses Groq’s GPT-OSS model for schema-checked JSON and Tavily for research. Provider quotas and model availability can change. The API stores accounts, sessions, and user-owned maps in `server/data/helix.sqlite` (or `HELIX_DB_PATH`). Back up that database with the API stopped. Existing `server/data/library.json` records are imported into the first account once; the JSON file is preserved. Browser-local maps are migrated during registration and then cached separately by account in the browser.

## API overview

- `GET /api/health` reports API availability.
- `POST /api/auth/register` creates an account and starts a session.
- `POST /api/auth/login` starts a session.
- `GET /api/auth/session` returns the current account.
- `POST /api/auth/logout` revokes the current session.
- `GET /api/library` lists the signed-in account’s maps.
- `GET /api/library/:filmId` retrieves one saved map.
- `PUT /api/library/:filmId` validates and creates or replaces a saved map.
- `POST /api/library/import` imports legacy browser maps without replacing existing records.
- `DELETE /api/library/:filmId` removes a saved map.
- TMDB search, metadata, watch providers, and story-map generation are served by the same API.

Library writes are validated and stored in SQLite with a user-scoped composite key and foreign-key enforcement. The built-in Node SQLite API is currently marked release candidate by Node.js. Accounts are local to this API; this version does not include email verification or password recovery. Use HTTPS before public deployment.

Run the backend checks with `npm test` (or `npm --prefix server test`). They cover story-map validation, SQLite persistence and migration, authentication, and account isolation.
