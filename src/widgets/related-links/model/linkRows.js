export function linkRowsAvailable(rows) {
  return rows.filter((row) => row.to).length
}
