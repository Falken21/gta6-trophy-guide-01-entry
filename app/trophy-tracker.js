// Main tracker for the Leonida Trophy Guide: loads the trophy and roadmap
// data, renders the checklist, filters, spoiler mode, detail panel and the
// export / import of saved progress. Everything runs offline from app/ files.

import { renderProgressBar, gradeLabel } from './trophy-progress.js';
import { renderRoadmap } from './trophy-roadmap.js';

const PROGRESS_KEY = 'leonida-trophy-progress-v1';
const SPOILER_KEY = 'leonida-spoiler-v1';
const EXPORT_NAME = 'leonida-trophy-progress.json';

const listEl = document.getElementById('trophyList');
const detailEl = document.getElementById('detailPanel');
const resultCountEl = document.getElementById('resultCount');
const searchEl = document.getElementById('searchInput');
const kindEl = document.getElementById('kindFilter');
const gradeEl = document.getElementById('gradeFilter');
const spoilerEl = document.getElementById('spoilerToggle');
const earnedOnlyEl = document.getElementById('earnedOnlyToggle');
const trackerView = document.getElementById('trackerView');
const roadmapView = document.getElementById('roadmapView');
const tabTracker = document.getElementById('tabTracker');
const tabRoadmap = document.getElementById('tabRoadmap');

let trophies = [];
let roadmap = null;
let earned = new Set(loadProgress());
let selectedName = null;

function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((name) => typeof name === 'string') : [];
  } catch {
    return [];
  }
}

function saveProgress() {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...earned]));
}

function spoilerOn() {
  return spoilerEl.checked;
}

function isHiddenBySpoiler(trophy) {
  return spoilerOn() && trophy.kind === 'story' && !earned.has(trophy.name);
}

function displayName(trophy) {
  return isHiddenBySpoiler(trophy) ? '??? — Hidden story trophy' : trophy.name;
}

function displayDescription(trophy) {
  return isHiddenBySpoiler(trophy)
    ? 'Hidden until earned — turn spoiler mode off to peek.'
    : trophy.description;
}

function trophyMatches(trophy) {
  if (kindEl.value !== 'all' && trophy.kind !== kindEl.value) return false;
  if (gradeEl.value !== 'all' && trophy.grade !== gradeEl.value) return false;
  if (earnedOnlyEl.checked && !earned.has(trophy.name)) return false;
  const query = searchEl.value.trim().toLowerCase();
  if (query) {
    const haystack = `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }
  return true;
}

function gradeBadge(trophy) {
  const badge = document.createElement('span');
  badge.className = `badge grade-${trophy.grade}`;
  badge.textContent = gradeLabel(trophy.grade);
  return badge;
}

function kindBadge(trophy) {
  const badge = document.createElement('span');
  badge.className = `badge kind-${trophy.kind}`;
  badge.textContent = trophy.kind;
  return badge;
}

function missableBadge() {
  const badge = document.createElement('span');
  badge.className = 'badge kind-missable';
  badge.textContent = 'Missable';
  return badge;
}

function renderList() {
  listEl.replaceChildren();
  const visible = trophies.filter(trophyMatches);
  resultCountEl.textContent = visible.length === trophies.length
    ? `Showing all ${trophies.length} trophies`
    : `Showing ${visible.length} of ${trophies.length} trophies`;
  if (!visible.length) {
    const empty = document.createElement('li');
    empty.className = 'empty-note';
    empty.textContent = 'No trophies match these filters. Try clearing the search or choosing another kind.';
    listEl.append(empty);
    return;
  }
  for (const trophy of visible) {
    const card = document.createElement('li');
    card.className = 'trophy-card';
    if (earned.has(trophy.name)) card.classList.add('earned');
    if (selectedName === trophy.name) card.classList.add('selected');

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = earned.has(trophy.name);
    box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    box.addEventListener('change', (event) => {
      event.stopPropagation();
      if (box.checked) earned.add(trophy.name);
      else earned.delete(trophy.name);
      saveProgress();
      renderAll();
    });
    card.append(box);

    const body = document.createElement('div');
    const name = document.createElement('div');
    name.className = 'trophy-name';
    name.textContent = displayName(trophy);
    body.append(name);
    const desc = document.createElement('div');
    desc.className = 'trophy-desc';
    desc.textContent = displayDescription(trophy);
    body.append(desc);
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    meta.append(gradeBadge(trophy), kindBadge(trophy));
    if (trophy.missable && trophy.kind !== 'missable') meta.append(missableBadge());
    body.append(meta);
    card.append(body);

    const open = document.createElement('button');
    open.type = 'button';
    open.className = 'badge';
    open.textContent = 'Guide';
    open.addEventListener('click', (event) => {
      event.stopPropagation();
      selectedName = trophy.name;
      renderAll();
    });
    card.append(open);

    card.addEventListener('click', () => {
      selectedName = trophy.name;
      renderAll();
    });
    listEl.append(card);
  }
}

function renderDetail() {
  detailEl.replaceChildren();
  const trophy = trophies.find((item) => item.name === selectedName);
  if (!trophy) {
    const empty = document.createElement('p');
    empty.className = 'detail-empty';
    empty.textContent = 'Select a trophy to read its guide, steps and sources.';
    detailEl.append(empty);
    return;
  }
  const heading = document.createElement('h2');
  heading.textContent = displayName(trophy);
  detailEl.append(heading);

  const official = document.createElement('p');
  official.className = 'detail-official';
  official.textContent = `${displayDescription(trophy)} — ${gradeLabel(trophy.grade)}`;
  detailEl.append(official);

  if (isHiddenBySpoiler(trophy)) {
    const hiddenNote = document.createElement('p');
    hiddenNote.className = 'detail-guide';
    hiddenNote.textContent = 'This is a story trophy you have not earned yet, so its guide, steps and sources stay hidden too. Earn it in the game — or turn spoiler mode off — to read them.';
    detailEl.append(hiddenNote);
    return;
  }

  if (trophy.missable) {
    const warning = document.createElement('p');
    warning.className = 'detail-warning';
    warning.textContent = 'Missable — this trophy can only be earned at a one-time story moment. Take it the first time it appears, or it may need a new playthrough.';
    detailEl.append(warning);
  }

  const guideTitle = document.createElement('h3');
  guideTitle.textContent = 'Guide';
  detailEl.append(guideTitle);
  const guide = document.createElement('p');
  guide.className = 'detail-guide';
  guide.textContent = trophy.guide;
  detailEl.append(guide);

  if (trophy.steps && trophy.steps.length) {
    const stepsTitle = document.createElement('h3');
    stepsTitle.textContent = 'Steps';
    detailEl.append(stepsTitle);
    const steps = document.createElement('ol');
    steps.className = 'detail-steps';
    for (const step of trophy.steps) {
      const item = document.createElement('li');
      item.textContent = step;
      steps.append(item);
    }
    detailEl.append(steps);
  }

  if (trophy.sources && trophy.sources.length) {
    const sourcesTitle = document.createElement('h3');
    sourcesTitle.textContent = 'Sources';
    detailEl.append(sourcesTitle);
    const sources = document.createElement('ul');
    sources.className = 'detail-sources';
    for (const source of trophy.sources) {
      const item = document.createElement('li');
      item.textContent = source;
      sources.append(item);
    }
    detailEl.append(sources);
  }
}

function renderProgress() {
  renderProgressBar(trophies, [...earned], {
    text: document.getElementById('progressText'),
    fill: document.getElementById('progressFill'),
    gradeCounts: document.getElementById('gradeCounts'),
  });
}

function renderRoadmapView() {
  if (!roadmap) return;
  renderRoadmap(roadmap, trophies, [...earned], {
    title: document.getElementById('roadmapTitle'),
    note: document.getElementById('roadmapNote'),
    list: document.getElementById('roadmapList'),
  });
}

function renderAll() {
  renderList();
  renderDetail();
  renderProgress();
  renderRoadmapView();
}

function showTab(which) {
  const onRoadmap = which === 'roadmap';
  trackerView.hidden = onRoadmap;
  roadmapView.hidden = !onRoadmap;
  tabTracker.classList.toggle('active', !onRoadmap);
  tabRoadmap.classList.toggle('active', onRoadmap);
  tabTracker.setAttribute('aria-pressed', String(!onRoadmap));
  tabRoadmap.setAttribute('aria-pressed', String(onRoadmap));
}

function exportProgress() {
  const payload = {
    game: 'Grand Theft Auto VI',
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = EXPORT_NAME;
  link.click();
  URL.revokeObjectURL(link.href);
}

async function importProgress(file) {
  if (!file) return;
  try {
    const parsed = JSON.parse(await file.text());
    const names = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    const known = new Set(trophies.map((trophy) => trophy.name));
    earned = new Set(names.filter((name) => typeof name === 'string' && known.has(name)));
    saveProgress();
    renderAll();
  } catch {
    resultCountEl.textContent = 'That file could not be imported — it is not a progress export from this guide.';
  }
}

function wireControls() {
  searchEl.addEventListener('input', renderAll);
  kindEl.addEventListener('change', renderAll);
  gradeEl.addEventListener('change', renderAll);
  earnedOnlyEl.addEventListener('change', renderAll);
  spoilerEl.addEventListener('change', () => {
    localStorage.setItem(SPOILER_KEY, spoilerEl.checked ? '1' : '0');
    renderAll();
  });
  document.getElementById('exportBtn').addEventListener('click', exportProgress);
  document.getElementById('importFile').addEventListener('change', (event) => {
    importProgress(event.target.files[0]);
    event.target.value = '';
  });
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (window.confirm('Clear all earned trophies?')) {
      earned = new Set();
      selectedName = null;
      saveProgress();
      renderAll();
    }
  });
  tabTracker.addEventListener('click', () => showTab('tracker'));
  tabRoadmap.addEventListener('click', () => showTab('roadmap'));
}

async function loadData() {
  const trophyResponse = await fetch('data/trophies.json');
  const trophyDoc = await trophyResponse.json();
  trophies = trophyDoc.trophies || trophyDoc;
  const roadmapResponse = await fetch('data/roadmap.json');
  roadmap = await roadmapResponse.json();
}

spoilerEl.checked = localStorage.getItem(SPOILER_KEY) === '1';
wireControls();
await loadData();
renderAll();
