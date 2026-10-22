import { ALLOWED_EXTENSIONS, FILE_LIMIT_BYTES } from './dictionaries.js'
import { hasPeriodOverlap } from './revisions.js'

function extensionOf(name = '') {
  const parts = name.toLowerCase().split('.')
  return parts.length > 1 ? parts.at(-1) : ''
}

export function fileProblems(file) {
  if (!file) return []
  const problems = []
  if (!ALLOWED_EXTENSIONS.includes(extensionOf(file.name))) {
    problems.push(`Файл «${file.name}» должен быть PDF, DOCX, Excel или изображением`)
  }
  if (file.size > FILE_LIMIT_BYTES) {
    problems.push(`Файл «${file.name}» больше 50 МБ`)
  }
  return problems
}

export function collectFiles(document) {
  return (document.revisions ?? []).flatMap((revision) =>
    [revision.file, revision.basisFile, ...(revision.attachments ?? [])].filter(Boolean),
  )
}

export function findDuplicateFiles(document, documents) {
  const ownFiles = collectFiles(document).filter((file) => file.hash)
  const warnings = []
  ownFiles.forEach((file) => {
    const sameInside = ownFiles.filter((item) => item.hash === file.hash && item.id !== file.id)
    if (sameInside.length) warnings.push(`Файл «${file.name}» повторяется внутри карточки`)
    documents.forEach((other) => {
      if (other.id === document.id) return
      collectFiles(other).forEach((otherFile) => {
        if (otherFile.hash && otherFile.hash === file.hash) {
          warnings.push(`Файл «${file.name}» совпадает с файлом документа ${other.number || other.shortTitle}`)
        }
      })
    })
  })
  return [...new Set(warnings)]
}

export function publishedDatesChanged(previous, next) {
  if (!previous?.published) return false
  if (previous.adoptedAt !== next.adoptedAt || previous.publishedAt !== next.publishedAt) return true
  const previousRanges = (previous.revisions ?? [])
    .map((revision) => `${revision.id}:${revision.effectiveFrom}:${revision.effectiveTo}`)
    .sort()
  const nextRanges = (next.revisions ?? [])
    .map((revision) => `${revision.id}:${revision.effectiveFrom}:${revision.effectiveTo}`)
    .sort()
  return previousRanges.join('|') !== nextRanges.join('|')
}

export function publicationIssues(document, { dateChangeConfirmed = false, previous = null } = {}) {
  const issues = []
  const add = (path, message) => issues.push({ path, message })

  if (!document.fullTitle?.trim()) add('fullTitle', 'Укажите полное название')
  if (!document.kind) add('kind', 'Укажите вид документа')
  if (!document.adoptedAt) add('adoptedAt', 'Укажите дату принятия')
  if (!document.ownerDeptId) add('ownerDeptId', 'Укажите владельца ВНД')
  if (!document.responsible?.trim()) add('responsible', 'Укажите ответственного')

  if (document.adoptedAt && document.publishedAt && document.publishedAt < document.adoptedAt) {
    add('publishedAt', 'Дата публикации не может быть раньше даты принятия')
  }

  const revisions = document.revisions ?? []
  if (!revisions.some((revision) => revision.file)) add('root.mainFile', 'Приложите основной файл')

  if (hasPeriodOverlap(revisions) && !document.overlapConfirmed) {
    add('overlapConfirmed', 'Периоды редакций пересекаются. Подтвердите пересечение или исправьте даты')
  }

  revisions.forEach((revision, index) => {
    const title = `Редакция ${revision.number || 'без номера'}`
    if (revision.effectiveFrom && revision.effectiveTo && revision.effectiveTo < revision.effectiveFrom) {
      add(`revisions.${index}.effectiveTo`, `${title}: дата окончания раньше начала`)
    }
    const incomplete = revision.incomplete && revision.incompleteReason?.trim()
    if ((!revision.confirmedStart || !revision.effectiveFrom) && !incomplete) {
      add(`revisions.${index}.incompleteReason`, `${title}: без подтверждённого начала действия нужна отметка неполноты и причина`)
    }
    if (!incomplete) {
      if (!revision.file) add(`revisions.${index}.file`, `${title}: нет основного файла`)
      if (!revision.basisFile) add(`revisions.${index}.basisFile`, `${title}: нет файла основания`)
    }
    if (revision.file) fileProblems(revision.file).forEach((message) => add(`revisions.${index}.file`, message))
    if (revision.basisFile) fileProblems(revision.basisFile).forEach((message) => add(`revisions.${index}.basisFile`, message))
  })

  if (publishedDatesChanged(previous, document) && !dateChangeConfirmed) {
    add('root.dateChangeConfirmed', 'Исправление опубликованной даты нужно подтвердить')
  }

  return issues
}

export function validatePublication(document, options) {
  return publicationIssues(document, options).map((issue) => issue.message)
}
