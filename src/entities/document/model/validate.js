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

export function validatePublication(document, { dateChangeConfirmed = false, previous = null } = {}) {
  const errors = []
  if (!document.fullTitle?.trim()) errors.push('Укажите полное название')
  if (!document.kind) errors.push('Укажите вид документа')
  if (!document.adoptedAt) errors.push('Укажите дату принятия')
  if (!document.ownerDeptId) errors.push('Укажите владельца ВНД')
  if (!document.responsible?.trim()) errors.push('Укажите ответственного')

  if (document.adoptedAt && document.publishedAt && document.publishedAt < document.adoptedAt) {
    errors.push('Дата публикации не может быть раньше даты принятия')
  }

  const revisions = document.revisions ?? []
  if (!revisions.some((revision) => revision.file)) errors.push('Приложите основной файл')

  if (hasPeriodOverlap(revisions) && !document.overlapConfirmed) {
    errors.push('Периоды редакций пересекаются. Подтвердите пересечение или исправьте даты')
  }

  revisions.forEach((revision) => {
    const title = `Редакция ${revision.number || 'без номера'}`
    if (revision.effectiveFrom && revision.effectiveTo && revision.effectiveTo < revision.effectiveFrom) {
      errors.push(`${title}: дата окончания раньше начала`)
    }
    const incomplete = revision.incomplete && revision.incompleteReason?.trim()
    if ((!revision.confirmedStart || !revision.effectiveFrom) && !incomplete) {
      errors.push(`${title}: без подтверждённого начала действия нужна отметка неполноты и причина`)
    }
    if (!incomplete) {
      if (!revision.file) errors.push(`${title}: нет основного файла`)
      if (!revision.basisFile) errors.push(`${title}: нет файла основания`)
    }
    if (revision.file) errors.push(...fileProblems(revision.file))
    if (revision.basisFile) errors.push(...fileProblems(revision.basisFile))
  })

  if (publishedDatesChanged(previous, document) && !dateChangeConfirmed) {
    errors.push('Исправление опубликованной даты нужно подтвердить')
  }

  return errors
}
