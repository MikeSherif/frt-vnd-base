import { formatDate } from '../../../shared/date-text'

export function headerFacts(document, revision) {
  const edition = revision?.number ? `редакция №${revision.number}` : '—'
  return [
    ['Вид ВНД', document.kindLabel],
    ['Дата принятия', formatDate(document.adoptedAt)],
    ['Владелец ВНД', document.owner],
    ['Владелец процесса', document.processOwner],
    ['Статус', document.statusLabel],
    ['Актуальность', document.relevanceLabel],
    ['Номер редакции', edition],
    ['Орган управления принявший документ', document.governingBody || '—'],
    ['Реквизиты документа принятия', document.adoptionDocDetails || '—'],
  ]
}
