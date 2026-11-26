const MAX_TEXT = 4000;
const MAX_NODES = 100;
const MAX_LINKS = 300;

const text = (value, max = MAX_TEXT) => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
const safeUrl = value => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
};

export function validateFilm(film) {
  if (!film || typeof film !== 'object' || Array.isArray(film)) return 'Film must be an object.';
  if (!/^tmdb-\d+$/.test(film.id) || film.graphId !== film.id) return 'Film ID must match its TMDB story-map ID.';
  if (!text(film.title, 200) || !text(String(film.year || ''), 4) || !text(film.director, 200)) return 'Film title, year, or director is invalid.';
  if (!Array.isArray(film.genre) || film.genre.length > 20 || film.genre.some(item => !text(item, 100))) return 'Film genres are invalid.';
  if (!text(film.twistTag, 120) || !Array.isArray(film.storyGraph?.nodes) || !Array.isArray(film.storyGraph?.links)) return 'Story map is missing required fields.';
  const { storyGraph } = film;
  if (storyGraph.id !== film.id || !text(storyGraph.title, 200) || !text(storyGraph.summary) || !text(storyGraph.twistType, 120)) return 'Story-map metadata does not match the film.';
  if (storyGraph.nodes.length < 2 || storyGraph.nodes.length > MAX_NODES || storyGraph.links.length < 1 || storyGraph.links.length > MAX_LINKS) return 'Story map has an invalid number of nodes or links.';

  const nodeIds = new Set();
  for (const node of storyGraph.nodes) {
    if (!node || !text(node.id, 180) || nodeIds.has(node.id) || !text(node.label, 200)) return 'Story map contains an invalid or duplicate node.';
    if (!['film', 'character', 'event', 'twist'].includes(node.type) || !Number.isInteger(node.spoilerLevel) || node.spoilerLevel < 0 || node.spoilerLevel > 2) return 'Story map contains an invalid node type or spoiler level.';
    nodeIds.add(node.id);
    if (node.sources !== undefined && (!Array.isArray(node.sources) || node.sources.length > 20 || node.sources.some(source => !text(source?.label, 200) || !safeUrl(source?.url)))) return 'Story map contains an invalid source URL.';
  }
  if (!nodeIds.has(film.id)) return 'Story map must include its film node.';
  for (const link of storyGraph.links) {
    if (!link || typeof link !== 'object' || Array.isArray(link)) return 'Story map contains an invalid connection.';
    const sourceId = typeof link.source === 'object' ? link.source?.id : link.source;
    const targetId = typeof link.target === 'object' ? link.target?.id : link.target;
    if (!nodeIds.has(sourceId) || !nodeIds.has(targetId) || sourceId === targetId || !text(link.relationship, 120) || !text(link.explanation)) return 'Story map contains an invalid connection.';
    if (link.spoilerLevel !== undefined && (!Number.isInteger(link.spoilerLevel) || link.spoilerLevel < 0 || link.spoilerLevel > 2)) return 'Story map contains an invalid connection spoiler level.';
  }
  if (film.tmdb?.sourceUrl && !safeUrl(film.tmdb.sourceUrl)) return 'Movie metadata contains an invalid source URL.';
  return null;
}
