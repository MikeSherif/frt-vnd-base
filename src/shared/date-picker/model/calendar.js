import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isValid, parseISO, startOfMonth, startOfWeek } from 'date-fns'

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
export const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export function parseIsoDate(value) {
  if (!value) return null
  const date = parseISO(value)
  return isValid(date) ? date : null
}

export function toIso(date) {
  return format(date, 'yyyy-MM-dd')
}

export function displayDate(value) {
  const date = parseIsoDate(value)
  return date ? format(date, 'dd.MM.yyyy') : ''
}

export function monthTitle(cursor) {
  return `${MONTHS[cursor.getMonth()]} ${cursor.getFullYear()}`
}

export function monthDays(cursor) {
  const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 })
  const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end })
}

export function shiftMonth(cursor, amount) {
  return addMonths(cursor, amount)
}

export function sameDay(left, right) {
  return Boolean(left && right && isSameDay(left, right))
}

export function inMonth(day, cursor) {
  return isSameMonth(day, cursor)
}
