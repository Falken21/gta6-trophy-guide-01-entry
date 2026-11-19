// Kind, grade, search and spoiler filters for the trophy checklist.
export function createFilterState() {
  return { kind: 'all', grade: 'all', query: '', spoiler: false };
}

export function trophyMatchesFilters(trophy, state) {
  if (state.kind !== 'all') {
    if (state.kind === 'missable') {
      if (!trophy.missable) return false;
    } else if (trophy.kind !== state.kind) {
      return false;
    }
  }
  if (state.grade !== 'all' && trophy.grade !== state.grade) return false;
  if (state.query) {
    const haystack = `${trophy.name} ${trophy.description}`.toLowerCase();
    if (!haystack.includes(state.query)) return false;
  }
  return true;
}

export function isSpoilerHidden(trophy, state, earned) {
  return state.spoiler && trophy.kind === 'story' && !earned.has(trophy.name);
}

export function wireFilterControls(state, onChange) {
  const kind = document.getElementById('kind');
  const grade = document.getElementById('grade');
  const search = document.getElementById('search');
  const spoiler = document.getElementById('spoiler');
  if (kind) kind.addEventListener('change', () => { state.kind = kind.value; onChange(); });
  if (grade) grade.addEventListener('change', () => { state.grade = grade.value; onChange(); });
  if (search) search.addEventListener('input', () => { state.query = search.value.trim().toLowerCase(); onChange(); });
  if (spoiler) spoiler.addEventListener('change', () => { state.spoiler = spoiler.checked; onChange(); });
}

export function renderFilterSummary(visibleCount, totalCount, state) {
  const el = document.getElementById('filter-summary');
  if (!el) return;
  const parts = [];
  if (state.kind !== 'all') parts.push(`kind: ${state.kind}`);
  if (state.grade !== 'all') parts.push(`grade: ${state.grade}`);
  if (state.query) parts.push(`search: “${state.query}”`);
  if (state.spoiler) parts.push('spoiler mode on — story trophies hidden until earned');
  el.textContent = `Showing ${visibleCount} of ${totalCount} trophies${parts.length ? ` — ${parts.join(' · ')}` : ''}.`;
}
