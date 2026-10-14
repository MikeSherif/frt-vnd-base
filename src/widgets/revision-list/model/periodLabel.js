import { formatDate } from '../../../shared/date-text'

export function periodLabel(revision, acting) {
  const from = formatDate(revision.effectiveFrom)
  if (acting || !revision.effectiveTo) return `От ${from}`
  return `${from} – ${formatDate(revision.effectiveTo)}`
}
