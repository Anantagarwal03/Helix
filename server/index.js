import express from 'express';
import cors from 'cors';
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

app.get('/api/movies', (req, res) => {
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
