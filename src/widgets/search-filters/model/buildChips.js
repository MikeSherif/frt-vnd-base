import {
  departmentName,
  DEPARTMENTS,
  DOCUMENT_KINDS,
  FUNCTIONS,
  functionName,
  labelOf,
  PRESETS,
  RELEVANCE,
  STATUSES,
} from '../../../entities/document'
import { formatDate } from '../../../shared/date-text'

export function buildChips(filters) {
  const chips = []
  if (filters.q) chips.push({ id: 'q', label: `Поиск: ${filters.q}`, patch: { q: '' } })
  if (filters.preset !== 'all') chips.push({ id: 'preset', label: labelOf(PRESETS, filters.preset), patch: { preset: 'all' } })
  filters.status.forEach((id) => chips.push({
    id: `status-${id}`,
    label: labelOf(STATUSES, id),
    patch: { status: filters.status.filter((item) => item !== id) },
  }))
  filters.kind.forEach((id) => chips.push({
    id: `kind-${id}`,
    label: labelOf(DOCUMENT_KINDS, id),
    patch: { kind: filters.kind.filter((item) => item !== id) },
  }))
  filters.owner.forEach((id) => chips.push({
    id: `owner-${id}`,
    label: `Владелец ВНД: ${departmentName(id)}`,
    patch: { owner: filters.owner.filter((item) => item !== id) },
  }))
  filters.processOwner.forEach((id) => chips.push({
    id: `process-${id}`,
    label: `Владелец процесса: ${departmentName(id)}`,
    patch: { processOwner: filters.processOwner.filter((item) => item !== id) },
  }))
  filters.relevance.forEach((id) => chips.push({
    id: `relevance-${id}`,
    label: labelOf(RELEVANCE, id),
    patch: { relevance: filters.relevance.filter((item) => item !== id) },
  }))
  filters.functionIds.forEach((id) => chips.push({
    id: `function-${id}`,
    label: functionName(id),
    patch: { functionIds: filters.functionIds.filter((item) => item !== id) },
  }))
  if (filters.adoptedFrom || filters.adoptedTo) {
    chips.push({
      id: 'adopted',
      label: `Принятие: ${formatDate(filters.adoptedFrom)} — ${formatDate(filters.adoptedTo)}`,
      patch: { adoptedFrom: '', adoptedTo: '' },
    })
  }
  if (filters.onDate) chips.push({ id: 'onDate', label: `Действовал на ${formatDate(filters.onDate)}`, patch: { onDate: '' } })
  if (filters.publishedFrom || filters.publishedTo) {
    chips.push({
      id: 'published',
      label: `Публикация: ${formatDate(filters.publishedFrom)} — ${formatDate(filters.publishedTo)}`,
      patch: { publishedFrom: '', publishedTo: '' },
    })
  }
  return chips
}

export { DEPARTMENTS, DOCUMENT_KINDS, FUNCTIONS, RELEVANCE, STATUSES }
