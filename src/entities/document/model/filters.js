import { departmentName, labelOf, RELEVANCE, STATUSES } from './dictionaries.js'
import {
  isActing,
  isArchivedDocument,
  isUpdatedWithin30,
  needsReview,
} from './metrics.js'
import { displayRevision, resolveRevision } from './revisions.js'

export const EMPTY_FILTERS = {
  q: '',
  preset: 'all',
  status: [],
  kind: [],
  owner: [],
  processOwner: [],
  relevance: [],
  functionIds: [],
  adoptedFrom: '',
  adoptedTo: '',
  publishedFrom: '',
  publishedTo: '',
  onDate: '',
  page: 1,
  pageSize: 20,
  sort: 'adoptedAt',
  sortDir: 'desc',
}

function includesQuery(document, query) {
  const haystack = [
    document.fullTitle,
    document.shortTitle,
    document.number,
    ...(document.keywords ?? []),
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

export function matchesFilters(document, filters, today) {
  if (!document.published) return false
  const query = filters.q.trim().toLowerCase()
  if (query && !includesQuery(document, query)) return false

  if (filters.preset === 'active' && !isActing(document, today)) return false
  if (filters.preset === 'archived' && !isArchivedDocument(document)) return false
  if (filters.preset === 'review' && !needsReview(document, today)) return false
  if (filters.preset === 'updated30' && !isUpdatedWithin30(document, today)) return false

  if (filters.status.length && !filters.status.includes(document.status)) return false
  if (filters.kind.length && !filters.kind.includes(document.kind)) return false
  if (filters.owner.length && !filters.owner.includes(document.ownerDeptId)) return false
  if (filters.processOwner.length && !filters.processOwner.includes(document.processOwnerDeptId)) return false
  if (filters.relevance.length && !filters.relevance.includes(document.relevance)) return false
  if (filters.functionIds.length) {
    const linked = (document.functionLinks ?? []).map((link) => link.functionId)
    if (!filters.functionIds.some((id) => linked.includes(id))) return false
  }
  if (filters.adoptedFrom && (!document.adoptedAt || document.adoptedAt < filters.adoptedFrom)) return false
  if (filters.adoptedTo && (!document.adoptedAt || document.adoptedAt > filters.adoptedTo)) return false
  if (filters.publishedFrom && (!document.publishedAt || document.publishedAt < filters.publishedFrom)) return false
  if (filters.publishedTo && (!document.publishedAt || document.publishedAt > filters.publishedTo)) return false
  if (filters.onDate && !resolveRevision(document.revisions, filters.onDate).revision) return false
  return true
}

export function filterDocuments(documents, filters, today) {
  return documents.filter((document) => matchesFilters(document, filters, today))
}

function sortValue(document, sort, today) {
  if (sort === 'title') return document.shortTitle || document.fullTitle || ''
  if (sort === 'kind') return document.kind || ''
  if (sort === 'owner') return departmentName(document.ownerDeptId)
  if (sort === 'status') return labelOf(STATUSES, document.status)
  if (sort === 'relevance') return labelOf(RELEVANCE, document.relevance)
  if (sort === 'revision') return String(displayRevision(document, today)?.number ?? 0).padStart(4, '0')
  return document.adoptedAt || ''
}

export function sortDocuments(documents, filters, today) {
  const factor = filters.sortDir === 'asc' ? 1 : -1
  return [...documents].sort((left, right) => {
    const result = sortValue(left, filters.sort, today).localeCompare(sortValue(right, filters.sort, today), 'ru', {
      numeric: true,
    })
    return result * factor
  })
}

export function parseFilters(params) {
  const list = (key) => {
    const value = params.get(key)
    return value ? value.split(',').filter(Boolean) : []
  }
  const pageSize = Number(params.get('pageSize'))
  return {
    ...EMPTY_FILTERS,
    q: params.get('q') ?? '',
    preset: params.get('preset') || 'all',
    status: list('status'),
    kind: list('kind'),
    owner: list('owner'),
    processOwner: list('processOwner'),
    relevance: list('relevance'),
    functionIds: list('function'),
    adoptedFrom: params.get('adoptedFrom') ?? '',
    adoptedTo: params.get('adoptedTo') ?? '',
    publishedFrom: params.get('publishedFrom') ?? '',
    publishedTo: params.get('publishedTo') ?? '',
    onDate: params.get('onDate') ?? '',
    page: Math.max(1, Number(params.get('page')) || 1),
    pageSize: [20, 50, 100].includes(pageSize) ? pageSize : 20,
    sort: params.get('sort') || 'adoptedAt',
    sortDir: params.get('sortDir') === 'asc' ? 'asc' : 'desc',
  }
}

export function serializeFilters(filters) {
  const params = new URLSearchParams()
  if (filters.q) params.set('q', filters.q)
  if (filters.preset && filters.preset !== 'all') params.set('preset', filters.preset)
  if (filters.status.length) params.set('status', filters.status.join(','))
  if (filters.kind.length) params.set('kind', filters.kind.join(','))
  if (filters.owner.length) params.set('owner', filters.owner.join(','))
  if (filters.processOwner.length) params.set('processOwner', filters.processOwner.join(','))
  if (filters.relevance.length) params.set('relevance', filters.relevance.join(','))
  if (filters.functionIds.length) params.set('function', filters.functionIds.join(','))
  if (filters.adoptedFrom) params.set('adoptedFrom', filters.adoptedFrom)
  if (filters.adoptedTo) params.set('adoptedTo', filters.adoptedTo)
  if (filters.publishedFrom) params.set('publishedFrom', filters.publishedFrom)
  if (filters.publishedTo) params.set('publishedTo', filters.publishedTo)
  if (filters.onDate) params.set('onDate', filters.onDate)
  if (filters.page > 1) params.set('page', String(filters.page))
  if (filters.pageSize !== 20) params.set('pageSize', String(filters.pageSize))
  if (filters.sort !== 'adoptedAt') params.set('sort', filters.sort)
  if (filters.sortDir !== 'desc') params.set('sortDir', filters.sortDir)
  return params
}
