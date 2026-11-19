// The detail panel: the selected trophy's guide, steps, sources and missable warning.
import { KIND_LABELS } from './trophy-list.js';

export function renderTrophyDetail(detailEl, trophy, earned, onToggle) {
  detailEl.replaceChildren();
  if (!trophy) {
    const empty = document.createElement('p');
    empty.className = 'detail-empty';
    empty.textContent = 'Select a trophy to read its guide, steps and sources.';
    detailEl.append(empty);
    return;
  }
  const title = document.createElement('h2');
  title.textContent = trophy.name;
  const official = document.createElement('p');
  official.className = 'official';
  const countText = trophy.count ? ` · target: ${trophy.count}` : '';
  official.textContent = `Official: “${trophy.description}” — ${trophy.grade}${countText} · ${KIND_LABELS[trophy.kind] || trophy.kind}`;
  detailEl.append(title, official);
  if (trophy.missable) {
    const warn = document.createElement('p');
    warn.className = 'missable-warning';
    warn.textContent = '⚠ MISSABLE — this trophy can only be earned in its story moment. Do it the first time the scene plays, or a new playthrough is needed.';
    detailEl.append(warn);
  }
  const guideHead = document.createElement('h3');
  guideHead.textContent = 'Guide';
  const guide = document.createElement('p');
  guide.textContent = trophy.guide;
  detailEl.append(guideHead, guide);
  if (trophy.steps && trophy.steps.length) {
    const stepsHead = document.createElement('h3');
    stepsHead.textContent = 'Steps';
    const steps = document.createElement('ol');
    for (const step of trophy.steps) {
      const li = document.createElement('li');
      li.textContent = step;
      steps.append(li);
    }
    detailEl.append(stepsHead, steps);
  }
  if (trophy.sources && trophy.sources.length) {
    const sourcesHead = document.createElement('h3');
    sourcesHead.textContent = 'Sources';
    const sources = document.createElement('ul');
    sources.className = 'sources';
    for (const source of trophy.sources) {
      const li = document.createElement('li');
      li.textContent = source;
      sources.append(li);
    }
    detailEl.append(sourcesHead, sources);
  }
  const actions = document.createElement('div');
  actions.className = 'detail-actions';
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'btn';
  toggle.textContent = earned.has(trophy.name) ? 'Mark as not earned' : 'Mark as earned';
  toggle.addEventListener('click', () => onToggle(trophy.name, !earned.has(trophy.name)));
  actions.append(toggle);
  detailEl.append(actions);
}
