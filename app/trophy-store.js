// Earned progress for the 55 trophies, kept in the browser's localStorage and
// exportable to a JSON file (and importable back) so a player never loses it.

export const PROGRESS_KEY = "gta6-trophy-guide-progress-v1";
export const EXPORT_FILENAME = "gta6-trophy-progress.json";

export function loadProgress() {
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      return new Set();
    }
    const parsed = JSON.parse(raw);
    const ids = Array.isArray(parsed) ? parsed : parsed.earnedIds;
    return new Set((ids || []).filter((id) => Number.isInteger(id)));
  } catch (error) {
    return new Set();
  }
}

export function saveProgress(earnedIds) {
  const payload = {
    game: "Grand Theft Auto VI",
    exportedAt: new Date().toISOString(),
    earnedIds: Array.from(earnedIds).sort((a, b) => a - b),
  };
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(payload));
}

export function toggleEarned(earnedIds, trophyId) {
  const next = new Set(earnedIds);
  if (next.has(trophyId)) {
    next.delete(trophyId);
  } else {
    next.add(trophyId);
  }
  saveProgress(next);
  return next;
}

export function exportProgress(earnedIds) {
  const payload = {
    game: "Grand Theft Auto VI",
    exportedAt: new Date().toISOString(),
    earnedIds: Array.from(earnedIds).sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = EXPORT_FILENAME;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export function parseImportedProgress(text) {
  const parsed = JSON.parse(text);
  const ids = Array.isArray(parsed) ? parsed : parsed.earnedIds;
  if (!Array.isArray(ids)) {
    throw new Error("Imported file has no earned trophy ids");
  }
  const clean = ids.filter((id) => Number.isInteger(id) && id >= 1 && id <= 55);
  return new Set(clean);
}
