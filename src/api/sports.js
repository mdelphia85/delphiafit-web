const BASE_URL = import.meta.env.VITE_API_URL;

export async function getSports(token) {
  const res = await fetch(`${BASE_URL}/sports/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getCategories(sport, token) {
  const res = await fetch(`${BASE_URL}/sports/${sport}/skills/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function getLevels(sport, category, token) {
  const res = await fetch(`${BASE_URL}/sports/${sport}/${category}/levels/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

export async function generateDrill(sport, category, level, token) {
  const res = await fetch(
    `${BASE_URL}/sports/${sport}/${category}/${level}/drills/`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.json();
}
