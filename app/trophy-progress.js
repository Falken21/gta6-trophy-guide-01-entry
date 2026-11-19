// Progress math and progress-bar rendering for the Leonida Trophy Guide.
// This file knows nothing about the DOM except the three progress elements
// it is handed; the tracker owns the rest of the page.

const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function countEarnedByGrade(trophies, earnedNames) {
  const earned = new Set(earnedNames);
  const counts = {};
  for (const grade of GRADE_ORDER) {
    counts[grade] = { earned: 0, total: 0 };
  }
  for (const trophy of trophies) {
    const slot = counts[trophy.grade];
    if (!slot) continue;
    slot.total += 1;
    if (earned.has(trophy.name)) slot.earned += 1;
  }
  return counts;
}

export function progressPercent(trophies, earnedNames) {
  if (!trophies.length) return 0;
  const earned = new Set(earnedNames);
  let done = 0;
  for (const trophy of trophies) {
    if (earned.has(trophy.name)) done += 1;
  }
  const percent = Math.round((done / trophies.length) * 100);
  return Math.min(100, Math.max(0, percent));
}

export function renderProgressBar(trophies, earnedNames, elements) {
  const { text, fill, gradeCounts } = elements;
  const earned = new Set(earnedNames);
  let done = 0;
  for (const trophy of trophies) {
    if (earned.has(trophy.name)) done += 1;
  }
  const percent = progressPercent(trophies, earnedNames);
  text.textContent = `${done} of ${trophies.length} earned — ${percent}%`;
  fill.style.width = `${percent}%`;
  const byGrade = countEarnedByGrade(trophies, earnedNames);
  const parts = GRADE_ORDER.map(
    (grade) => `${gradeLabel(grade)} ${byGrade[grade].earned}/${byGrade[grade].total}`,
  );
  gradeCounts.textContent = parts.join(' · ');
}
