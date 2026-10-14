export function filtersAreNarrowed(filters) {
  return Boolean(
    filters.q
    || filters.preset !== 'all'
    || filters.status.length
    || filters.kind.length
    || filters.owner.length
    || filters.processOwner.length
    || filters.relevance.length
    || filters.functionIds.length
    || filters.adoptedFrom
    || filters.adoptedTo
    || filters.publishedFrom
    || filters.publishedTo
    || filters.onDate,
  )
}
