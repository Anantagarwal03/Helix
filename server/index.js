import express from 'express';
import cors from 'cors';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

app.use(cors({
  origin: 'http://localhost:5173'
}));

const getDbData = () => {
  const dbPath = path.join(__dirname, 'data', 'db.json');
  const rawData = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(rawData);
};

app.get('/api/movies', async (req, res) => {
  try {
    const data = getDbData();
    const enhancedMovies = await Promise.all(data.movies.map(async (movie) => {
      try {
        // Use axios with explicit headers to prevent request rejection
        const response = await axios.get(`http://www.omdbapi.com/?t=${encodeURIComponent(movie.title)}&apikey=2a806969`, {
          headers: { 'Accept': 'application/json' }
        });
        
        const omdbData = response.data;
        let posterUrl = omdbData.Poster;
        
        if (!posterUrl || posterUrl === "N/A") {
          posterUrl = "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600";
        }
        
        return { ...movie, posterUrl };
      } catch (err) {
        console.error(`OMDb error for ${movie.title}:`, err.message);
        return { ...movie, posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600" };
      }
    }));
    res.json(enhancedMovies);
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
