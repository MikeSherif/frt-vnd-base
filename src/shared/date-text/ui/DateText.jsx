import { formatDate } from '../model/dates.js'

export function DateText({ value }) {
  return <time dateTime={value || undefined}>{formatDate(value)}</time>
}
