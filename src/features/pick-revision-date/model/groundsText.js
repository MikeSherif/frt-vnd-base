export function groundsText(revision, formatDate) {
  if (!revision) return ''
  const end = revision.effectiveTo ? ` по ${formatDate(revision.effectiveTo)}` : ''
  return `Редакция ${revision.number}, с ${formatDate(revision.effectiveFrom)}${end}. Основание: ${revision.basisDetails || 'не указано'}.`
}
