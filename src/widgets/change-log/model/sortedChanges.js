import { formatDateTime } from '../../../shared/date-text'

export function sortedChanges(entries = []) {
  return [...entries].sort((left, right) => (right.at || '').localeCompare(left.at || ''))
}

export function changeMoment(value) {
  return formatDateTime(value)
}
