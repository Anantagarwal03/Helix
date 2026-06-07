export async function fetchDonnieDarkoStills() {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  if (!apiKey) {
    console.warn("TMDB API key missing. Ensure VITE_TMDB_API_KEY is set.");
    return [];
  }

  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/141/images?api_key=${apiKey}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const cleanStills = data.backdrops.filter(img => img.iso_639_1 === null);
    return cleanStills || [];
  } catch (error) {
    console.error("Failed to fetch TMDB images:", error);
    return [];
  }
}
