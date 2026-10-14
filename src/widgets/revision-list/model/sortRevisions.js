export function sortRevisions(revisions) {
  return [...revisions].sort((left, right) => (right.number ?? 0) - (left.number ?? 0))
}
