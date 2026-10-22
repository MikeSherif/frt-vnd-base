import { departmentName, labelOf, RELEVANCE, STATUSES } from '../model/dictionaries.js'
import { SEED_VERSION, buildSeed } from '../model/seed.js'
import { validatePublication, findDuplicateFiles } from '../model/validate.js'
import { assertRules } from '../model/assertRules.js'

const STORAGE_KEY = 'vnd-kb-v1'
const sessionFiles = new Map()

const FIELD_LABELS = {
  number: 'Номер',
  shortTitle: 'Краткое наименование',
  fullTitle: 'Полное наименование',
  kind: 'Вид документа',
  status: 'Статус',
  relevance: 'Актуальность',
  ownerDeptId: 'Владелец ВНД',
  processOwnerDeptId: 'Владелец процесса',
  responsible: 'Ответственный',
  adoptedAt: 'Дата принятия',
  publishedAt: 'Дата публикации',
  governingBody: 'Орган управления',
  adoptionDocKind: 'Вид документа принятия',
  adoptionDocDetails: 'Реквизиты документа принятия',
  nextCheckAt: 'Дата следующей проверки',
}

function displayValue(key, value) {
  if (!value) return '—'
  if (key === 'status') return labelOf(STATUSES, value)
  if (key === 'relevance') return labelOf(RELEVANCE, value)
  if (key === 'ownerDeptId' || key === 'processOwnerDeptId') return departmentName(value)
  return String(value)
}

function createState() {
  return {
    seedVersion: SEED_VERSION,
    documents: buildSeed(),
    favorites: {},
    subscriptions: {},
  }
}

function dehydrateFile(file) {
  if (!file) return null
  if (file.url?.startsWith('blob:')) {
    sessionFiles.set(file.id, file.url)
    return { ...file, url: '' }
  }
  return file
}

function hydrateFile(file) {
  if (!file) return null
  if (file.url) return file
  const url = sessionFiles.get(file.id)
  return url ? { ...file, url } : file
}

function hydrateDocument(document) {
  return {
    ...document,
    revisions: (document.revisions ?? []).map((revision) => ({
      ...revision,
      file: hydrateFile(revision.file),
      basisFile: hydrateFile(revision.basisFile),
      attachments: (revision.attachments ?? []).map(hydrateFile),
    })),
  }
}

function dehydrateDocument(document) {
  return {
    ...document,
    revisions: (document.revisions ?? []).map((revision) => ({
      ...revision,
      file: dehydrateFile(revision.file),
      basisFile: dehydrateFile(revision.basisFile),
      attachments: (revision.attachments ?? []).map(dehydrateFile),
    })),
  }
}

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.seedVersion !== SEED_VERSION) return null
    return {
      ...parsed,
      documents: (parsed.documents ?? []).map(hydrateDocument),
    }
  } catch {
    return null
  }
}

let state = typeof localStorage === 'undefined' ? createState() : readStorage() ?? createState()

function persist() {
  try {
    const payload = {
      ...state,
      documents: state.documents.map(dehydrateDocument),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Демонстрация остаётся в памяти, если браузер запретил хранилище.
  }
}

function emit(next) {
  state = next
  persist()
}

export function readBundle() {
  return state
}

export function resetDemo() {
  sessionFiles.clear()
  emit(createState())
  return state
}

export function getDocument(id) {
  return state.documents.find((document) => document.id === id) ?? null
}

function blankToNull(value) {
  return value ? value : null
}

function normalizeDocument(document) {
  return {
    ...document,
    keywords: Array.isArray(document.keywords)
      ? document.keywords.map((item) => String(item).trim()).filter(Boolean)
      : String(document.keywords ?? '')
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
    revisions: (document.revisions ?? []).map((revision) => ({
      ...revision,
      effectiveFrom: blankToNull(revision.effectiveFrom),
      effectiveTo: blankToNull(revision.effectiveTo),
      attachments: revision.attachments ?? [],
    })),
    functionLinks: document.functionLinks ?? [],
    documentLinks: document.documentLinks ?? [],
    relevanceEvents: document.relevanceEvents ?? [],
    changelog: document.changelog ?? [],
  }
}

function appendChangelog(previous, next, actor) {
  if (!previous) {
    const created = {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      who: actor,
      field: 'Карточка',
      oldValue: '—',
      newValue: next.published ? 'Опубликована' : 'Черновик',
      reason: 'Создание карточки',
    }
    return { ...next, changelog: [created, ...(next.changelog ?? [])] }
  }

  const entries = []
  Object.entries(FIELD_LABELS).forEach(([key, label]) => {
    const oldValue = displayValue(key, previous[key])
    const newValue = displayValue(key, next[key])
    if (oldValue === newValue) return
    const dateField = ['adoptedAt', 'publishedAt', 'nextCheckAt'].includes(key)
    entries.push({
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      who: actor,
      field: label,
      oldValue,
      newValue,
      reason: dateField && previous.published ? 'Исправление опубликованной даты' : 'Изменение реквизита',
    })
  })

  const previousRevisions = (previous.revisions ?? []).map((revision) => revision.number).join(', ')
  const nextRevisions = (next.revisions ?? []).map((revision) => revision.number).join(', ')
  if (previousRevisions !== nextRevisions) {
    entries.push({
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      who: actor,
      field: 'Редакции',
      oldValue: previousRevisions || '—',
      newValue: nextRevisions || '—',
      reason: 'Изменение состава редакций',
    })
  }

  return { ...next, changelog: [...entries, ...(previous.changelog ?? [])] }
}

export function saveDocument(draft, { publish = false, dateChangeConfirmed = false, actor = 'Сотрудник' } = {}) {
  const existing = state.documents.find((document) => document.id === draft.id) ?? null
  if (existing && existing.version !== draft.version) {
    return {
      ok: false,
      errors: ['Карточку уже изменили. Обновите страницу и повторите сохранение.'],
    }
  }

  const next = normalizeDocument({
    ...draft,
    published: publish ? true : Boolean(existing?.published || draft.published),
  })

  if (next.published) {
    const errors = validatePublication(next, { dateChangeConfirmed, previous: existing })
    if (errors.length) return { ok: false, errors }
  }

  const warnings = findDuplicateFiles(next, state.documents)
  const withLog = appendChangelog(existing, next, actor)
  const saved = {
    ...withLog,
    version: (existing?.version ?? 0) + 1,
    revisions: withLog.revisions.map((revision) => ({
      ...revision,
      locked: next.published ? true : revision.locked,
    })),
    relevanceEvents: withLog.relevanceEvents.map((event) => ({
      ...event,
      locked: next.published ? true : event.locked,
    })),
  }

  const documents = existing
    ? state.documents.map((document) => (document.id === saved.id ? saved : document))
    : [saved, ...state.documents]
  emit({ ...state, documents })

  const notice =
    existing?.published && dateChangeConfirmed
      ? 'Существенное изменение дат зафиксировано в журнале.'
      : ''
  return { ok: true, warnings, notice, document: saved }
}

function toggleId(list = [], id) {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id]
}

export function toggleFavorite(userId, documentId) {
  const current = state.favorites[userId] ?? []
  emit({
    ...state,
    favorites: { ...state.favorites, [userId]: toggleId(current, documentId) },
  })
  return state
}

export function isFavorite(userId, documentId, source = state) {
  return (source.favorites?.[userId] ?? []).includes(documentId)
}

export function toggleSubscription(userId, target) {
  const current = state.subscriptions[userId] ?? { section: false, documents: [] }
  const next =
    target === 'section'
      ? { ...current, section: !current.section }
      : { ...current, documents: toggleId(current.documents, target) }
  emit({
    ...state,
    subscriptions: { ...state.subscriptions, [userId]: next },
  })
  return state
}

export function isSubscribed(userId, target, source = state) {
  const current = source.subscriptions?.[userId] ?? { section: false, documents: [] }
  if (target === 'section') return current.section
  return current.documents.includes(target)
}

export function createEmptyDocument() {
  return {
    id: crypto.randomUUID(),
    number: '',
    shortTitle: '',
    fullTitle: '',
    kind: '',
    status: 'active',
    relevance: 'unchecked',
    ownerDeptId: '',
    processOwnerDeptId: '',
    responsible: '',
    adoptedAt: '',
    publishedAt: '',
    governingBody: '',
    adoptionDocKind: '',
    adoptionDocDetails: '',
    summary: '',
    keywords: [],
    published: false,
    version: 0,
    nextCheckAt: '',
    overlapConfirmed: false,
    revisions: [
      {
        id: crypto.randomUUID(),
        number: 1,
        effectiveFrom: '',
        effectiveTo: '',
        confirmedStart: true,
        isSubstantive: true,
        publishedAt: '',
        incomplete: false,
        incompleteReason: '',
        file: null,
        basisFile: null,
        attachments: [],
        basisDetails: '',
        locked: false,
      },
    ],
    functionLinks: [],
    documentLinks: [],
    relevanceEvents: [],
    changelog: [],
  }
}

if (import.meta.env.DEV) assertRules()
