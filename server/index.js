import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const getTmdbApiKey = () => {
  if (process.env.TMDB_API_KEY) return process.env.TMDB_API_KEY;

  // Read the server-only key from the project root without exposing it to Vite.
  try {
    const envFile = fs.readFileSync(path.join(projectRoot, '.env'), 'utf8');
    const match = envFile.match(/^TMDB_API_KEY=(.*)$/m);
    return match?.[1]?.trim().replace(/^['"]|['"]$/g, '') || '';
  } catch {
    return '';
  }
};

const app = express();
const PORT = 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174']
}));

app.get('/api/search-movies', async (req, res) => {
  const query = String(req.query.query || '').trim();
  if (query.length < 2) {
    return res.status(400).json({ error: 'Enter at least two characters to search.' });
  }

  const apiKey = getTmdbApiKey();
  if (!apiKey) {
    return res.status(503).json({ error: 'Movie search is not configured. Add TMDB_API_KEY to the project .env file.' });
  }

  try {
    const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: { api_key: apiKey, query, include_adult: false },
      headers: { Accept: 'application/json' },
      timeout: 10000,
    });

    const results = (response.data.results || []).slice(0, 8).map((movie) => ({
      providerId: movie.id,
      title: movie.title,
      year: movie.release_date?.slice(0, 4) || '',
      overview: movie.overview || '',
      posterUrl: movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : null,
      source: 'TMDB',
    }));

    res.json({ results });
  } catch (error) {
    const status = error.response?.status === 401 ? 502 : 502;
    res.status(status).json({ error: 'Movie search could not reach TMDB. Check the server key and try again.' });
  }
});

app.get('/api/movie-metadata', async (req, res) => {
  const title = String(req.query.title || '').trim();
  const year = String(req.query.year || '').trim();
  if (!title || !year) return res.status(400).json({ error: 'A movie title and year are required.' });

  const apiKey = getTmdbApiKey();
  if (!apiKey) return res.status(503).json({ error: 'Movie metadata is not configured. Add TMDB_API_KEY to the project .env file.' });

  try {
    const search = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: { api_key: apiKey, query: title, year, include_adult: false },
      timeout: 10000,
    });
    const matches = search.data.results || [];
    const film = matches.find(item => item.release_date?.slice(0, 4) === year);
    if (!film) return res.status(404).json({ error: `No TMDB match found for ${title} (${year}).` });

    const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${film.id}`, {
      params: { api_key: apiKey, append_to_response: 'credits' },
      timeout: 10000,
    });
    const details = detailsResponse.data;
    const director = details.credits?.crew?.find(person => person.job === 'Director')?.name || null;
    res.json({
      providerId: details.id,
      title: details.title,
      year: details.release_date?.slice(0, 4) || year,
      overview: details.overview || '',
      posterUrl: details.poster_path ? `https://image.tmdb.org/t/p/w500${details.poster_path}` : null,
      genres: (details.genres || []).map(genre => genre.name),
      director,
      rating: Number(details.vote_average || 0),
      voteCount: Number(details.vote_count || 0),
      source: 'TMDB',
      sourceUrl: `https://www.themoviedb.org/movie/${details.id}`,
      fetchedAt: new Date().toISOString(),
      matchedExactly: details.release_date?.slice(0, 4) === year,
    });
  } catch {
    res.status(502).json({ error: 'Could not fetch movie metadata from TMDB. Check the server key and try again.' });
  }
});

app.get('/api/movie-watch-providers', async (req, res) => {
  const region = String(req.query.region || 'IN').toUpperCase();
  const title = String(req.query.title || '').trim();
  const year = String(req.query.year || '').trim();
  if (!/^[A-Z]{2}$/.test(region)) return res.status(400).json({ error: 'Region must be a two-letter country code.' });
  if (!title || !year) return res.status(400).json({ error: 'A movie title and year are required.' });
  const apiKey = getTmdbApiKey();
  if (!apiKey) return res.status(503).json({ error: 'Watch availability is not configured.' });

  try {
    const search = await axios.get('https://api.themoviedb.org/3/search/movie', {
      params: { api_key: apiKey, query: title, year, include_adult: false },
      timeout: 10000,
    });
    const match = (search.data.results || []).find(movie => movie.release_date?.slice(0, 4) === year);
    if (!match) return res.status(404).json({ error: 'Could not find an exact title and year match.' });
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${match.id}/watch/providers`, {
      params: { api_key: apiKey },
      timeout: 10000,
    });
    const regionData = response.data.results?.[region] || {};
    res.json({
      region,
      link: regionData.link || null,
      providers: [
        ...(regionData.flatrate || []).map(provider => ({ ...provider, availability: 'Stream' })),
        ...(regionData.free || []).map(provider => ({ ...provider, availability: 'Free' })),
        ...(regionData.ads || []).map(provider => ({ ...provider, availability: 'Free with ads' })),
        ...(regionData.rent || []).map(provider => ({ ...provider, availability: 'Rent' })),
        ...(regionData.buy || []).map(provider => ({ ...provider, availability: 'Buy' })),
      ],
    });
  } catch {
    res.status(502).json({ error: 'Could not load watch availability right now.' });
  }
});

const getDbData = () => {
  const dbPath = path.join(__dirname, 'data', 'db.json');
  const rawData = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(rawData);
};

app.get('/api/movies', async (req, res) => {
  try {
    const data = getDbData();
    res.json(data.movies);
  } catch (error) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.get('/api/timelines/:movieId', (req, res) => {
  try {
    const data = getDbData();
    const movieId = req.params.movieId;
    const timeline = data.timelines[movieId];
    
    if (timeline) {
      res.json(timeline);
    } else {
      res.status(404).json({ error: "Timeline not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to read database" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
