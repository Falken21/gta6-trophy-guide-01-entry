// Renders the checklist, the trophy detail panel, the roadmap and the progress
// bar from the trophy data. Everything here builds plain DOM nodes — no
// framework, no network — so the guide renders the same with the network off.

import { displayDescription, displayName, isSpoilerHidden } from "./trophy-filters.js";

function badge(text, extraClass) {
  const span = document.createElement("span");
  span.className = `badge ${extraClass || ""}`.trim();
  span.textContent = text;
  return span;
}

function trophyMetaRow(trophy) {
  const row = document.createElement("div");
  row.className = "trophy-meta";
  row.append(badge(trophy.grade, trophy.grade));
  row.append(badge(trophy.kind, "kind"));
  if (trophy.missable) {
    row.append(badge("Missable", "missable"));
  }
  return row;
}

export function renderChecklist(listEl, trophies, state, onSelect, onToggle) {
  listEl.replaceChildren();
  for (const trophy of trophies) {
    const earned = state.earnedIds.has(trophy.id);
    const item = document.createElement("li");
    item.className = "trophy-row" + (earned ? " earned" : "");
    if (state.selectedId === trophy.id) {
      item.classList.add("selected");
    }

    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = earned;
    box.setAttribute("aria-label", `Mark ${trophy.name} as earned`);
    box.addEventListener("change", (event) => {
      event.stopPropagation();
      onToggle(trophy.id);
    });

    const body = document.createElement("div");
    const name = document.createElement("div");
    name.className = "trophy-name";
    name.textContent = displayName(trophy, state.spoilerOn, state.earnedIds);
    const desc = document.createElement("div");
    desc.className = "trophy-desc";
    desc.textContent = displayDescription(trophy, state.spoilerOn, state.earnedIds);
    body.append(name, desc, trophyMetaRow(trophy));

    item.append(box, body);
    item.tabIndex = 0;
    item.addEventListener("click", () => onSelect(trophy.id));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onSelect(trophy.id);
      }
    });
    listEl.append(item);
  }
}

export function renderDetail(panelEl, trophy, state) {
  panelEl.replaceChildren();
  if (!trophy) {
    const hint = document.createElement("p");
    hint.textContent = "Select a trophy on the left to read its guide.";
    panelEl.append(hint);
    return;
  }

  const earned = state.earnedIds.has(trophy.id);
  const hidden = isSpoilerHidden(trophy, state.spoilerOn, state.earnedIds);

  const title = document.createElement("h2");
  title.textContent = displayName(trophy, state.spoilerOn, state.earnedIds);
  panelEl.append(title);
  panelEl.append(trophyMetaRow(trophy));

  const official = document.createElement("p");
  official.innerHTML = "<strong>Official description:</strong> ";
  official.append(document.createTextNode(displayDescription(trophy, state.spoilerOn, state.earnedIds)));
  panelEl.append(official);

  if (trophy.missable) {
    const warn = document.createElement("p");
    warn.className = "missable-warning";
    warn.textContent = "Missable — this trophy can be missed. Read the guide below before the moment passes.";
    panelEl.append(warn);
  }

  if (hidden) {
    const note = document.createElement("p");
    note.className = "spoiler-hidden";
    note.textContent = "Spoiler mode hides this story trophy until you earn it. Tick its checkbox to reveal it.";
    panelEl.append(note);
    return;
  }

  const guideHeading = document.createElement("h3");
  guideHeading.textContent = "Guide";
  const guide = document.createElement("p");
  guide.textContent = trophy.guide;
  panelEl.append(guideHeading, guide);

  if (trophy.steps && trophy.steps.length > 0) {
    const stepsHeading = document.createElement("h3");
    stepsHeading.textContent = "Steps";
    const steps = document.createElement("ol");
    for (const step of trophy.steps) {
      const li = document.createElement("li");
      li.textContent = step;
      steps.append(li);
    }
    panelEl.append(stepsHeading, steps);
  }

  if (trophy.sources && trophy.sources.length > 0) {
    const sourcesHeading = document.createElement("h3");
    sourcesHeading.textContent = "Sources";
    const sources = document.createElement("ul");
    for (const source of trophy.sources) {
      const li = document.createElement("li");
      li.textContent = source;
      sources.append(li);
    }
    panelEl.append(sourcesHeading, sources);
  }

  const status = document.createElement("p");
  status.textContent = earned
    ? "Earned — ticked off in your checklist."
    : "Not earned yet — tick its checkbox when it pops.";
  panelEl.append(status);
}

export function renderRoadmap(listEl, introEl, roadmap, trophiesById, earnedIds) {
  introEl.textContent = roadmap.note || "";
  listEl.replaceChildren();
  for (const stage of roadmap.stages) {
    const item = document.createElement("li");
    item.className = "roadmap-stage";

    const heading = document.createElement("h3");
    heading.textContent = `Stage ${stage.stage} — ${stage.title}`;
    const summary = document.createElement("p");
    summary.textContent = stage.summary;
    item.append(heading, summary);

    const chips = document.createElement("div");
    chips.className = "stage-trophies";
    for (const id of stage.trophyIds) {
      const trophy = trophiesById.get(id);
      if (!trophy) {
        continue;
      }
      const chip = document.createElement("span");
      chip.className = "stage-trophy";
      if (trophy.missable) {
        chip.classList.add("missable-flag");
      }
      if (earnedIds.has(id)) {
        chip.classList.add("earned-flag");
      }
      chip.textContent = trophy.missable
        ? `${trophy.name} — missable`
        : trophy.name;
      chips.append(chip);
    }
    item.append(chips);

    if (stage.missableWarning) {
      const warn = document.createElement("p");
      warn.className = "missable-warning";
      warn.textContent = stage.missableWarning;
      item.append(warn);
    }
    listEl.append(item);
  }
}

export function renderProgress(els, trophies, earnedIds) {
  const total = trophies.length;
  const earned = trophies.filter((trophy) => earnedIds.has(trophy.id)).length;
  const percent = total === 0 ? 0 : Math.round((earned / total) * 100);
  els.label.textContent = `${earned} of ${total} earned`;
  els.percent.textContent = `${percent}%`;
  els.fill.style.width = `${percent}%`;

  const order = ["platinum", "gold", "silver", "bronze"];
  const parts = order.map((grade) => {
    const inGrade = trophies.filter((trophy) => trophy.grade === grade);
    const done = inGrade.filter((trophy) => earnedIds.has(trophy.id)).length;
    return `${grade} ${done}/${inGrade.length}`;
  });
  els.counts.textContent = parts.join(" · ");
}
