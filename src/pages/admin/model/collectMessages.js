const SKIPPED = new Set(['ref', 'type', 'types', 'message'])

export function collectMessages(errors, into = []) {
  if (!errors || typeof errors !== 'object') return into
  if (typeof errors.message === 'string') into.push(errors.message)
  if (Array.isArray(errors)) {
    errors.forEach((item) => collectMessages(item, into))
    return into
  }
  Object.entries(errors).forEach(([key, value]) => {
    if (SKIPPED.has(key)) return
    collectMessages(value, into)
  })
  return into
}
