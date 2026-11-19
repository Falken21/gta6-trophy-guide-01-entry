// Bootstrap: load the trophy data and the roadmap, then wire the tracker together.
import { loadEarned, saveEarned, renderProgress, wireExportImport } from './trophy-progress.js';
import { createFilterState, trophyMatchesFilters, wireFilterControls, renderFilterSummary } from './trophy-filters.js';
import { renderTrophyList } from './trophy-list.js';
import { renderTrophyDetail } from './trophy-detail.js';
import { renderRoadmap } from './trophy-roadmap.js';

const trophiesDoc = await (await fetch('data/trophies.json')).json();
const roadmapDoc = await (await fetch('data/roadmap.json')).json();
const trophies = trophiesDoc.trophies;
const trophiesByName = new Map(trophies.map((t) => [t.name, t]));
const trophiesById = new Map(trophies.map((t) => [t.id, t]));
const knownNames = new Set(trophies.map((t) => t.name));

const state = createFilterState();
let earned = loadEarned();
let selectedName = null;

const listEl = document.getElementById('trophy-list');
const detailEl = document.getElementById('detail');

function renderAll() {
  const visible = trophies.filter((t) => trophyMatchesFilters(t, state));
  const shown = renderTrophyList(listEl, visible, state, earned, selectedName, onToggleEarned, onSelectTrophy);
  renderFilterSummary(shown, trophies.length, state);
  renderTrophyDetail(detailEl, selectedName ? trophiesByName.get(selectedName) : null, earned, onToggleEarned);
  renderProgress(earned, trophies);
  renderRoadmap(document.getElementById('roadmap-stages'), roadmapDoc, trophiesById, earned, onSelectTrophy);
}

function onToggleEarned(name, value) {
  if (value) earned.add(name);
  else earned.delete(name);
  saveEarned(earned);
  renderAll();
}

function onSelectTrophy(name) {
  selectedName = name;
  showView('checklist');
  renderAll();
  const card = [...listEl.children].find((el) => el.querySelector('.trophy-name').textContent === name || el.querySelector('.trophy-name').textContent === 'Hidden story trophy');
  if (card) card.scrollIntoView({ block: 'nearest' });
}

function showView(which) {
  const checklistView = document.getElementById('view-checklist');
  const roadmapView = document.getElementById('view-roadmap');
  const checklistTab = document.getElementById('tab-checklist');
  const roadmapTab = document.getElementById('tab-roadmap');
  const showRoadmap = which === 'roadmap';
  checklistView.hidden = showRoadmap;
  roadmapView.hidden = !showRoadmap;
  checklistTab.classList.toggle('active', !showRoadmap);
  roadmapTab.classList.toggle('active', showRoadmap);
}

document.getElementById('tab-checklist').addEventListener('click', () => showView('checklist'));
document.getElementById('tab-roadmap').addEventListener('click', () => showView('roadmap'));
document.getElementById('roadmap-title').textContent = roadmapDoc.title;
document.getElementById('roadmap-intro').textContent = roadmapDoc.intro;

wireFilterControls(state, renderAll);
wireExportImport(
  () => earned,
  (next) => { earned = next; saveEarned(earned); renderAll(); },
  knownNames,
);
renderAll();
