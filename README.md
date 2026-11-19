# Helix

Helix maps films as spoiler-aware story graphs. TMDB supplies movie metadata; Tavily finds plot sources and Groq drafts the graph for review before it is added to the library.

## Local setup

1. Install the dependencies with `npm install` and `npm install --prefix server`.
2. Copy `.env.example` to `.env`. Add your TMDB, Groq, and Tavily keys there. Keep `.env` local; it is ignored by Git.
3. Start the frontend with `npm run dev`.
4. In another terminal, start the API server with `npm run dev:server`.

The frontend uses the API server at `http://127.0.0.1:5001` through the Vite `/api` proxy. Set `HELIX_API_PORT` in the shell to use another port if needed.

## Drafting a story map

In Library, search for a title and choose the correct TMDB result. Generate the story-map draft, review its beats, spoiler levels, connections, and source links, then approve it to add it to the browser’s library. Draft generation is limited to five requests per hour per client IP.

Story-map generation uses Groq’s free-tier GPT-OSS model for schema-checked JSON and Tavily’s free search allowance for research (1,000 search credits monthly, with basic search requests costing one credit). Free-tier limits can change. Generated maps are saved in the current browser’s local storage. They are not synced between browsers yet.
