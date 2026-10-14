export function pageWindow(current, pages) {
  if (pages <= 5) return Array.from({ length: pages }, (_, index) => index + 1)
  const numbers = [...new Set([1, 2, 3, current, pages])]
    .filter((page) => page >= 1 && page <= pages)
    .sort((left, right) => left - right)
  const items = []
  numbers.forEach((page, index) => {
    if (index > 0 && page - numbers[index - 1] > 1) items.push(`gap-${page}`)
    items.push(page)
  })
  return items
}
