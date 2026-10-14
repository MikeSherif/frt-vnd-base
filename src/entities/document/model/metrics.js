import { shiftIso, todayIso } from '../../../shared/lib/dates.js'
import { resolveRevision } from './revisions.js'

export function isActing(document, today) {
  if (!document.published || document.status === 'archived' || !document.ownerDeptId) return false
  return Boolean(resolveRevision(document.revisions, today).revision)
}

export function isArchivedDocument(document) {
  return Boolean(document.published && document.status === 'archived')
}

export function needsReview(document, today) {
  if (!isActing(document, today)) return false
  if (['unchecked', 'needs_review', 'needs_change'].includes(document.relevance)) return true
  return Boolean(document.nextCheckAt && document.nextCheckAt <= today)
}

export function isUpdatedWithin30(document, today) {
  if (!document.published) return false
  const from = shiftIso(-30, new Date(`${today}T00:00:00`))
  return document.revisions.some(
    (revision) =>
      revision.isSubstantive &&
      revision.publishedAt &&
      revision.publishedAt >= from &&
      revision.publishedAt <= today,
  )
}

export function isFutureDocument(document, today) {
  if (!document.published || document.status === 'archived') return false
  const confirmed = document.revisions.filter((revision) => revision.confirmedStart && revision.effectiveFrom)
  if (confirmed.length === 0) return false
  return confirmed.every((revision) => revision.effectiveFrom > today)
}

export function hasUnknownPeriod(document) {
  if (!document.published) return false
  return !document.revisions.some((revision) => revision.confirmedStart && revision.effectiveFrom)
}

export function computeMetrics(documents, now = new Date()) {
  const today = todayIso(now)
  const published = documents.filter((document) => document.published)
  const metrics = {
    total: published.length,
    active: 0,
    archived: 0,
    review: 0,
    updated: 0,
    future: 0,
    unknownPeriod: 0,
    noOwner: 0,
    calculatedAt: now.toISOString(),
  }

  published.forEach((document) => {
    if (isActing(document, today)) metrics.active += 1
    if (isArchivedDocument(document)) metrics.archived += 1
    if (needsReview(document, today)) metrics.review += 1
    if (isUpdatedWithin30(document, today)) metrics.updated += 1
    if (isFutureDocument(document, today)) metrics.future += 1
    if (hasUnknownPeriod(document)) metrics.unknownPeriod += 1
    if (!document.ownerDeptId) metrics.noOwner += 1
  })

  return metrics
}
