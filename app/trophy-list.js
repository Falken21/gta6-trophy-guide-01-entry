// The checklist: one card per trophy with its official name, description and grade.
import { isSpoilerHidden } from './trophy-filters.js';

export const KIND_LABELS = {
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
};

function cardBadges(trophy) {
  const badges = [];
  badges.push(`<span class="badge">${KIND_LABELS[trophy.kind] || trophy.kind}</span>`);
  if (trophy.count) badges.push(`<span class="badge">× ${trophy.count}</span>`);
  if (trophy.missable) badges.push('<span class="badge missable">⚠ Missable</span>');
  return badges.join('');
}

export function renderTrophyList(listEl, trophies, state, earned, selectedName, onToggle, onSelect) {
  listEl.replaceChildren();
  let shown = 0;
  for (const trophy of trophies) {
    const li = document.createElement('li');
    li.className = 'trophy-card' + (earned.has(trophy.name) ? ' earned' : '') + (trophy.name === selectedName ? ' selected' : '');
    const hidden = isSpoilerHidden(trophy, state, earned);
    const shownName = hidden ? 'Hidden story trophy' : trophy.name;
    const shownDesc = hidden ? 'Spoiler mode hides this story trophy until you earn it.' : trophy.description;
    const head = document.createElement('div');
    head.className = 'trophy-head';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'trophy-check';
    box.checked = earned.has(trophy.name);
    box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
    box.addEventListener('change', () => onToggle(trophy.name, box.checked));
    box.addEventListener('click', (event) => event.stopPropagation());
    const name = document.createElement('span');
    name.className = 'trophy-name';
    name.textContent = shownName;
    const grade = document.createElement('span');
    grade.className = `trophy-grade grade-${trophy.grade}`;
    grade.textContent = trophy.grade;
    head.append(box, name, grade);
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = shownDesc;
    const meta = document.createElement('div');
    meta.className = 'trophy-meta';
    meta.innerHTML = cardBadges(trophy);
    li.append(head, desc, meta);
    li.addEventListener('click', () => onSelect(trophy.name));
    listEl.append(li);
    shown += 1;
  }
  return shown;
}
