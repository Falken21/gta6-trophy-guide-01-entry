// The roadmap to the platinum: ordered stages built from the official descriptions.
export function renderRoadmap(roadmapEl, roadmap, trophiesById, earned, onSelectTrophy) {
  roadmapEl.replaceChildren();
  for (const stage of roadmap.stages) {
    const li = document.createElement('li');
    li.className = 'roadmap-stage';
    const head = document.createElement('h3');
    head.textContent = `Stage ${stage.stage} — ${stage.title}`;
    const summary = document.createElement('p');
    summary.textContent = stage.summary;
    li.append(head, summary);
    if (stage.tips && stage.tips.length) {
      const tips = document.createElement('ul');
      for (const tip of stage.tips) {
        const tipLi = document.createElement('li');
        tipLi.textContent = tip;
        tips.append(tipLi);
      }
      li.append(tips);
    }
    const chips = document.createElement('div');
    chips.className = 'roadmap-trophies';
    for (const id of stage.trophy_ids) {
      const trophy = trophiesById.get(id);
      if (!trophy) continue;
      const chip = document.createElement('span');
      chip.className = 'badge' + (trophy.missable ? ' missable' : '');
      chip.textContent = (earned.has(trophy.name) ? '✓ ' : '') + trophy.name + (trophy.missable ? ' ⚠' : '');
      chip.title = 'Open this trophy in the checklist';
      chip.style.cursor = 'pointer';
      chip.addEventListener('click', () => onSelectTrophy(trophy.name));
      chips.append(chip);
    }
    li.append(chips);
    roadmapEl.append(li);
  }
}
