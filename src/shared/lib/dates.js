import { format, isValid, parseISO, startOfDay } from 'date-fns'

export function parseIso(value) {
  if (!value) return null
  const date = typeof value === 'string' ? parseISO(value) : value
  if (!isValid(date)) return null
  return startOfDay(date)
}

export function formatDate(value) {
  const date = parseIso(value)
  if (!date) return 'не установлена'
  return format(date, 'dd.MM.yyyy')
}

export function formatDateTime(value) {
  const date = value instanceof Date ? value : parseISO(value)
  if (!isValid(date)) return 'не установлена'
  return format(date, 'dd.MM.yyyy HH:mm')
}

export function todayIso(now = new Date()) {
  return format(startOfDay(now), 'yyyy-MM-dd')
}

export function shiftIso(days, from = new Date()) {
  const date = startOfDay(from instanceof Date ? from : new Date(from))
  date.setDate(date.getDate() + days)
  return format(date, 'yyyy-MM-dd')
}

export function compareIso(left, right) {
  if (left === right) return 0
  if (!left) return -1
  if (!right) return 1
  return left < right ? -1 : 1
}
