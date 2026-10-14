export function pageCount(total, pageSize) {
  if (!total) return 1
  return Math.max(1, Math.ceil(total / pageSize))
}
