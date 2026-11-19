// Filtering, searching and spoiler masking for the trophy checklist.
// "missable" is a filter of its own: it matches any trophy whose missable flag
// is set, whatever its kind. "online" matches nothing in the official list —
// the empty state says so instead of failing silently.

export function trophyMatchesKind(trophy, kind) {
  if (kind === "all") {
    return true;
  }
  if (kind === "missable") {
    return trophy.missable === true;
  }
  return trophy.kind === kind;
}

export function trophyMatchesGrade(trophy, grade) {
  return grade === "all" || trophy.grade === grade;
}

export function trophyMatchesSearch(trophy, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) {
    return true;
  }
  const haystack = [trophy.name, trophy.description, trophy.guide, trophy.kind]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(needle);
}

export function filterTrophies(trophies, filters) {
  return trophies.filter(
    (trophy) =>
      trophyMatchesKind(trophy, filters.kind) &&
      trophyMatchesGrade(trophy, filters.grade) &&
      trophyMatchesSearch(trophy, filters.query),
  );
}

export function isSpoilerHidden(trophy, spoilerOn, earnedIds) {
  return spoilerOn && trophy.kind === "story" && !earnedIds.has(trophy.id);
}

export function displayName(trophy, spoilerOn, earnedIds) {
  if (isSpoilerHidden(trophy, spoilerOn, earnedIds)) {
    return "Hidden story trophy";
  }
  return trophy.name;
}

export function displayDescription(trophy, spoilerOn, earnedIds) {
  if (isSpoilerHidden(trophy, spoilerOn, earnedIds)) {
    return "Hidden until earned — spoiler mode is on.";
  }
  return trophy.description;
}

export function countByGrade(trophies, earnedIds) {
  const counts = { platinum: [0, 0], gold: [0, 0], silver: [0, 0], bronze: [0, 0] };
  for (const trophy of trophies) {
    const bucket = counts[trophy.grade];
    if (!bucket) {
      continue;
    }
    bucket[1] += 1;
    if (earnedIds.has(trophy.id)) {
      bucket[0] += 1;
    }
  }
  return counts;
}
