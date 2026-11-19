// Progress storage, export/import and the progress bar for the trophy tracker.
export const STORAGE_KEY = 'gta6-trophy-checklist';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const names = JSON.parse(raw);
    return new Set(Array.isArray(names) ? names : []);
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned]));
}

export function renderProgress(earned, trophies) {
  const total = trophies.length;
  const done = earned.size;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const fill = document.getElementById('progress-fill');
  const text = document.getElementById('progress-text');
  const counts = document.getElementById('grade-counts');
  if (fill) fill.style.width = `${pct}%`;
  if (text) text.textContent = `${done} of ${total} earned · ${pct}%`;
  if (counts) {
    const byGrade = {};
    for (const t of trophies) {
      const got = earned.has(t.name) ? 1 : 0;
      byGrade[t.grade] = byGrade[t.grade] || { got: 0, total: 0 };
      byGrade[t.grade].got += got;
      byGrade[t.grade].total += 1;
    }
    counts.textContent = ['platinum', 'gold', 'silver', 'bronze']
      .filter((g) => byGrade[g])
      .map((g) => `${g}: ${byGrade[g].got}/${byGrade[g].total}`)
      .join(' · ');
  }
}

export function exportProgress(earned) {
  const blob = new Blob([JSON.stringify({ exported_at: new Date().toISOString(), earned: [...earned] }, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importProgressFile(file, knownNames) {
  const parsed = JSON.parse(await file.text());
  const names = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(names)) throw new Error('That file does not hold a trophy list.');
  const kept = names.filter((n) => knownNames.has(n));
  return new Set(kept);
}

export function wireExportImport(getEarned, setEarned, knownNames) {
  const exportButton = document.getElementById('export');
  if (exportButton) exportButton.addEventListener('click', () => exportProgress(getEarned()));
  const importInput = document.getElementById('import');
  if (importInput) {
    importInput.addEventListener('change', async (event) => {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      try {
        const next = await importProgressFile(file, knownNames);
        setEarned(next);
      } catch (error) {
        alert(`Could not import that file: ${error.message}`);
      }
      event.target.value = '';
    });
  }
}
