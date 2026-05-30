const BASE_URL = import.meta.env.VITE_API_URL;

// ---------------------------------------------------------
// GET SPORTS LIST
// ---------------------------------------------------------
export async function getSports(token) {
  const res = await fetch(`${BASE_URL}/sports`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ---------------------------------------------------------
// GET CATEGORIES
// ---------------------------------------------------------
export async function getCategories(sport, token) {
  const res = await fetch(`${BASE_URL}/sports/${sport}/skills`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ---------------------------------------------------------
// GET LEVELS
// ---------------------------------------------------------
export async function getLevels(sport, category, token) {
  const res = await fetch(`${BASE_URL}/sports/${sport}/${category}/levels`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

// ---------------------------------------------------------
// GET DRILL (GET, not POST)
// ---------------------------------------------------------
export async function generateDrill(sport, category, level, token) {
  const res = await fetch(
    `${BASE_URL}/sports/${sport}/${category}/${level}/drills`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.json();
}
