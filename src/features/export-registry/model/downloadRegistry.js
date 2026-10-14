import { departmentName, displayRevision, labelOf, RELEVANCE, STATUSES, DOCUMENT_KINDS } from '../../../entities/document'
import { formatDate, formatDateTime } from '../../../shared/date-text'

function filterLines(filters) {
  return [
    ['Дата формирования', formatDateTime(new Date())],
    ['Поиск', filters.q || '—'],
    ['Выборка', filters.preset || 'all'],
    ['Статус', filters.status.join(', ') || '—'],
    ['Вид', filters.kind.join(', ') || '—'],
    ['Владелец ВНД', filters.owner.join(', ') || '—'],
    ['Владелец процесса', filters.processOwner.join(', ') || '—'],
    ['Актуальность', filters.relevance.join(', ') || '—'],
    ['Функция', filters.functionIds.join(', ') || '—'],
    ['Период принятия', [filters.adoptedFrom, filters.adoptedTo].filter(Boolean).join(' — ') || '—'],
    ['Действовал на дату', filters.onDate || '—'],
    ['Период публикации', [filters.publishedFrom, filters.publishedTo].filter(Boolean).join(' — ') || '—'],
    ['Сортировка', `${filters.sort} ${filters.sortDir}`],
  ]
}

export async function downloadRegistry(documents, filters, today) {
  const ExcelJS = (await import('exceljs')).default
  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'База знаний ВНД'
  const sheet = workbook.addWorksheet('Реестр')
  sheet.columns = [
    { header: 'Номер', key: 'number', width: 16 },
    { header: 'Краткое наименование', key: 'shortTitle', width: 36 },
    { header: 'Полное наименование', key: 'fullTitle', width: 48 },
    { header: 'Вид', key: 'kind', width: 28 },
    { header: 'Статус', key: 'status', width: 18 },
    { header: 'Актуальность', key: 'relevance', width: 24 },
    { header: 'Дата принятия', key: 'adoptedAt', width: 18 },
    { header: 'Дата публикации', key: 'publishedAt', width: 18 },
    { header: 'Начало действия', key: 'from', width: 18 },
    { header: 'Окончание действия', key: 'to', width: 20 },
    { header: 'Владелец ВНД', key: 'owner', width: 36 },
    { header: 'Владелец процесса', key: 'processOwner', width: 36 },
    { header: 'Редакция', key: 'revision', width: 12 },
    { header: 'Ссылка', key: 'link', width: 48 },
  ]
  documents.forEach((document) => {
    const revision = displayRevision(document, today)
    const link = `${window.location.origin}${window.location.pathname}#/documents/${document.id}`
    sheet.addRow({
      number: document.number,
      shortTitle: document.shortTitle,
      fullTitle: document.fullTitle,
      kind: labelOf(DOCUMENT_KINDS, document.kind),
      status: labelOf(STATUSES, document.status),
      relevance: labelOf(RELEVANCE, document.relevance),
      adoptedAt: formatDate(document.adoptedAt),
      publishedAt: formatDate(document.publishedAt),
      from: formatDate(revision?.effectiveFrom),
      to: revision?.effectiveTo ? formatDate(revision.effectiveTo) : 'не установлена',
      owner: departmentName(document.ownerDeptId),
      processOwner: departmentName(document.processOwnerDeptId),
      revision: revision?.number ?? '—',
      link,
    })
  })
  sheet.getRow(1).font = { bold: true }

  const conditions = workbook.addWorksheet('Условия выгрузки')
  conditions.columns = [
    { header: 'Параметр', key: 'name', width: 32 },
    { header: 'Значение', key: 'value', width: 48 },
  ]
  filterLines(filters).forEach((line) => conditions.addRow({ name: line[0], value: line[1] }))
  conditions.getRow(1).font = { bold: true }

  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'reestr-vnd.xlsx'
  link.click()
  URL.revokeObjectURL(url)
}
