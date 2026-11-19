// Loads the trophy list and the platinum roadmap from the app's own data files.
// Both files live under app/data/ and are fetched with relative paths, so the
// guide works with the network off from any static file server.

export async function loadTrophies() {
  const response = await fetch("data/trophies.json");
  if (!response.ok) {
    throw new Error("Could not load data/trophies.json");
  }
  const data = await response.json();
  const list = Array.isArray(data) ? data : data.trophies;
  return list.slice().sort((a, b) => a.id - b.id);
}

export async function loadRoadmap() {
  const response = await fetch("data/roadmap.json");
  if (!response.ok) {
    throw new Error("Could not load data/roadmap.json");
  }
  return response.json();
}

export function indexTrophiesById(trophies) {
  const byId = new Map();
  for (const trophy of trophies) {
    byId.set(trophy.id, trophy);
  }
  return byId;
}
