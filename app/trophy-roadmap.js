// Roadmap rendering for the Leonida Trophy Guide: turns the ordered stage
// data in app/data/roadmap.json into the stage cards on the Roadmap tab.
// A stage lists its trophies as chips, marking each one earned or missable.

export function renderRoadmap(roadmap, trophies, earnedNames, elements) {
  const { title, note, list } = elements;
  const earned = new Set(earnedNames);
  const byId = new Map(trophies.map((trophy) => [trophy.id, trophy]));

  title.textContent = roadmap.title || 'Road to the Platinum';
  note.textContent = roadmap.note || '';
  list.replaceChildren();

  const stages = [...(roadmap.stages || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  for (const stage of stages) {
    const item = document.createElement('li');
    item.className = 'roadmap-stage';

    const heading = document.createElement('h3');
    heading.textContent = stage.title;
    item.append(heading);

    const stageDone = (stage.trophy_ids || []).filter((id) => {
      const trophy = byId.get(id);
      return trophy && earned.has(trophy.name);
    }).length;
    const stageCount = document.createElement('p');
    stageCount.className = 'roadmap-count';
    stageCount.textContent = `${stageDone} of ${(stage.trophy_ids || []).length} trophies in this stage earned`;
    item.append(stageCount);

    const summary = document.createElement('p');
    summary.textContent = stage.summary;
    item.append(summary);

    if (stage.tip) {
      const tip = document.createElement('p');
      tip.className = 'roadmap-tip';
      tip.textContent = `Tip: ${stage.tip}`;
      item.append(tip);
    }

    const chips = document.createElement('div');
    chips.className = 'roadmap-trophies';
    for (const id of stage.trophy_ids || []) {
      const trophy = byId.get(id);
      if (!trophy) continue;
      const chip = document.createElement('span');
      chip.className = 'roadmap-chip';
      chip.textContent = trophy.name;
      if (earned.has(trophy.name)) chip.classList.add('done');
      if (trophy.missable) chip.classList.add('flagged');
      chips.append(chip);
    }
    item.append(chips);
    list.append(item);
  }
}
