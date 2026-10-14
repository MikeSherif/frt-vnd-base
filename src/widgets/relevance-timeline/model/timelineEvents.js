import { labelOf, RELEVANCE_EVENT_TYPES } from '../../../entities/document'

export function timelineEvents(events) {
  return [...events].sort((left, right) => (left.date || '').localeCompare(right.date || ''))
}

export function eventLabel(type) {
  return labelOf(RELEVANCE_EVENT_TYPES, type)
}
