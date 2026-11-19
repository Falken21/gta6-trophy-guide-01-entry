// Entry point: loads the trophy data, wires the filters, the spoiler toggle,
// the export/import buttons and the tracker/roadmap tabs, and re-renders on
// every change. Progress is saved to localStorage on each tick.

import { indexTrophiesById, loadRoadmap, loadTrophies } from "./trophy-data.js";
import {
  exportProgress,
  loadProgress,
  parseImportedProgress,
  saveProgress,
  toggleEarned,
} from "./trophy-store.js";
import { filterTrophies } from "./trophy-filters.js";
import {
  renderChecklist,
  renderDetail,
  renderProgress,
  renderRoadmap,
} from "./trophy-render.js";

const DEFAULT_SELECTED_ID = 20;

const state = {
  trophies: [],
  trophiesById: new Map(),
  roadmap: null,
  earnedIds: loadProgress(),
  selectedId: DEFAULT_SELECTED_ID,
  spoilerOn: false,
  filters: { query: "", kind: "all", grade: "all" },
};

const els = {
  searchBox: document.getElementById("search-box"),
  kindFilter: document.getElementById("kind-filter"),
  gradeFilter: document.getElementById("grade-filter"),
  spoilerToggle: document.getElementById("spoiler-toggle"),
  exportButton: document.getElementById("export-button"),
  importButton: document.getElementById("import-button"),
  importFile: document.getElementById("import-file"),
  filterNote: document.getElementById("filter-note"),
  checklist: document.getElementById("checklist"),
  emptyNote: document.getElementById("empty-note"),
  detailPanel: document.getElementById("detail-panel"),
  progressLabel: document.getElementById("progress-label"),
  progressPercent: document.getElementById("progress-percent"),
  progressFill: document.getElementById("progress-fill"),
  gradeCounts: document.getElementById("grade-counts"),
  tabTracker: document.getElementById("tab-tracker"),
  tabRoadmap: document.getElementById("tab-roadmap"),
  viewTracker: document.getElementById("view-tracker"),
  viewRoadmap: document.getElementById("view-roadmap"),
  roadmapIntro: document.getElementById("roadmap-intro"),
  roadmapList: document.getElementById("roadmap-list"),
  dataNote: document.getElementById("data-note"),
};

function renderAll() {
  const visible = filterTrophies(state.trophies, state.filters);
  renderChecklist(els.checklist, visible, state, selectTrophy, toggleTrophy);
  renderDetail(els.detailPanel, state.trophiesById.get(state.selectedId), state);
  renderProgress(
    {
      label: els.progressLabel,
      percent: els.progressPercent,
      fill: els.progressFill,
      counts: els.gradeCounts,
    },
    state.trophies,
    state.earnedIds,
  );
  els.emptyNote.hidden = visible.length > 0;
  const shown = visible.length;
  const total = state.trophies.length;
  els.filterNote.textContent =
    shown === total
      ? `Showing all ${total} trophies.`
      : `Showing ${shown} of ${total} trophies.`;
  if (state.roadmap) {
    renderRoadmap(
      els.roadmapList,
      els.roadmapIntro,
      state.roadmap,
      state.trophiesById,
      state.earnedIds,
    );
  }
}

function selectTrophy(trophyId) {
  state.selectedId = trophyId;
  renderAll();
}

function toggleTrophy(trophyId) {
  state.earnedIds = toggleEarned(state.earnedIds, trophyId);
  renderAll();
}

function showTracker() {
  els.viewTracker.hidden = false;
  els.viewRoadmap.hidden = true;
  els.tabTracker.classList.add("active");
  els.tabRoadmap.classList.remove("active");
}

function showRoadmap() {
  els.viewTracker.hidden = true;
  els.viewRoadmap.hidden = false;
  els.tabRoadmap.classList.add("active");
  els.tabTracker.classList.remove("active");
  if (state.roadmap) {
    renderRoadmap(
      els.roadmapList,
      els.roadmapIntro,
      state.roadmap,
      state.trophiesById,
      state.earnedIds,
    );
  }
}

async function initGuide() {
  state.trophies = await loadTrophies();
  state.trophiesById = indexTrophiesById(state.trophies);
  state.roadmap = await loadRoadmap();

  els.dataNote.textContent = `Data: ${state.trophies.length} trophies — 1 platinum, 2 gold, 6 silver, 46 bronze. Progress is saved in this browser only; export it to keep a copy.`;

  els.searchBox.addEventListener("input", () => {
    state.filters.query = els.searchBox.value;
    renderAll();
  });
  els.kindFilter.addEventListener("change", () => {
    state.filters.kind = els.kindFilter.value;
    renderAll();
  });
  els.gradeFilter.addEventListener("change", () => {
    state.filters.grade = els.gradeFilter.value;
    renderAll();
  });
  els.spoilerToggle.addEventListener("change", () => {
    state.spoilerOn = els.spoilerToggle.checked;
    renderAll();
  });
  els.exportButton.addEventListener("click", () => {
    exportProgress(state.earnedIds);
  });
  els.importButton.addEventListener("click", () => {
    els.importFile.click();
  });
  els.importFile.addEventListener("change", async () => {
    const file = els.importFile.files && els.importFile.files[0];
    if (!file) {
      return;
    }
    try {
      const text = await file.text();
      state.earnedIds = parseImportedProgress(text);
      saveProgress(state.earnedIds);
      renderAll();
    } catch (error) {
      els.filterNote.textContent = "That file could not be imported — it is not a progress export from this guide.";
    }
    els.importFile.value = "";
  });
  els.tabTracker.addEventListener("click", showTracker);
  els.tabRoadmap.addEventListener("click", showRoadmap);

  renderAll();
}

initGuide().catch((error) => {
  els.detailPanel.textContent = `The guide could not load its data: ${error.message}`;
});
