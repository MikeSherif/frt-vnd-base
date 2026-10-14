import { compareIso } from '../../../shared/lib/dates.js'

function rangeEnd(revision) {
  return revision.effectiveTo || '9999-12-31'
}

export function hasPeriodOverlap(revisions = []) {
  const ranges = revisions
    .filter((revision) => revision.effectiveFrom)
    .map((revision) => ({
      from: revision.effectiveFrom,
      to: rangeEnd(revision),
    }))
    .sort((left, right) => compareIso(left.from, right.from))

  for (let index = 1; index < ranges.length; index += 1) {
    if (compareIso(ranges[index].from, ranges[index - 1].to) <= 0) return true
  }
  return false
}

export function resolveRevision(revisions = [], onDate) {
  if (!onDate) {
    return { revision: null, reason: 'Дата не указана.' }
  }

  if (hasPeriodOverlap(revisions)) {
    return {
      revision: null,
      reason: 'Периоды редакций пересекаются. Достоверную редакцию на выбранную дату показать нельзя.',
    }
  }

  const reliable = revisions.filter((revision) => revision.confirmedStart && revision.effectiveFrom)
  const matches = reliable.filter((revision) => {
    if (compareIso(onDate, revision.effectiveFrom) < 0) return false
    if (revision.effectiveTo && compareIso(onDate, revision.effectiveTo) > 0) return false
    return true
  })

  if (matches.length === 1) {
    return { revision: matches[0], reason: null }
  }

  if (matches.length > 1) {
    return {
      revision: null,
      reason: 'На выбранную дату найдено несколько редакций. Последовательность недостоверна.',
    }
  }

  const hasUnreliable = revisions.some((revision) => !revision.confirmedStart || !revision.effectiveFrom)
  return {
    revision: null,
    reason: hasUnreliable
      ? 'На выбранную дату нет редакции с подтверждённым периодом действия.'
      : 'На выбранную дату документ не действовал.',
  }
}

export function lastRevision(revisions = []) {
  return [...revisions].sort((left, right) => (right.number ?? 0) - (left.number ?? 0))[0] ?? null
}

export function displayRevision(document, today) {
  if (document.status === 'archived') return lastRevision(document.revisions)
  return resolveRevision(document.revisions, today).revision ?? lastRevision(document.revisions)
}

export function revisionById(document, revisionId) {
  return document.revisions.find((revision) => revision.id === revisionId) ?? null
}
