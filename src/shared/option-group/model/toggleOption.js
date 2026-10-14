export function toggleOption(value, id) {
  return value.includes(id) ? value.filter((item) => item !== id) : [...value, id]
}
