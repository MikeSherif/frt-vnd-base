import { useState } from 'react'
import {
  DEPARTMENTS,
  DOCUMENT_KINDS,
  FUNCTION_ROLES,
  FUNCTIONS,
  RELEVANCE,
  RELEVANCE_EVENT_TYPES,
  STATUSES,
  VND_LINK_ROLES,
} from '../../../entities/document'
import { Button } from '../../../shared/button'
import { DatePicker } from '../../../shared/date-picker'
import { Field } from '../../../shared/field'
import { Select } from '../../../shared/select'
import { readFileMeta, withItem, withoutItem } from '../model/readFileMeta.js'
import styles from './DocumentForm.module.css'

function optionsOf(list, labelKey = 'label') {
  return list.map((item) => ({ id: item.id, label: item[labelKey] }))
}

function blankRevision(number) {
  return {
    id: crypto.randomUUID(),
    number,
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
  }
}

export function DocumentForm({ value, documents, onChange }) {
  const [fileError, setFileError] = useState('')

  function update(patch) {
    onChange({ ...value, ...patch })
  }

  function updateRevision(id, patch) {
    update({ revisions: withItem(value.revisions, id, patch) })
  }

  async function attach(id, key, file) {
    if (!file) return
    setFileError('')
    try {
      updateRevision(id, { [key]: await readFileMeta(file) })
    } catch (error) {
      setFileError(error.message)
    }
  }

  const others = documents.filter((document) => document.id !== value.id && document.published)

  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
      <section className={styles.block}>
        <h2>Реквизиты</h2>
        <div className={styles.grid}>
          <Field label="Краткое наименование"><input value={value.shortTitle} onChange={(event) => update({ shortTitle: event.target.value })} /></Field>
          <Field label="Номер ВНД"><input value={value.number} onChange={(event) => update({ number: event.target.value })} /></Field>
          <Field label="Полное наименование" className={styles.wide}>
            <input value={value.fullTitle} onChange={(event) => update({ fullTitle: event.target.value })} />
          </Field>
          <Field label="Вид документа">
            <Select placeholder="Выберите" clearable value={value.kind} options={optionsOf(DOCUMENT_KINDS)} onChange={(kind) => update({ kind })} />
          </Field>
          <Field label="Статус">
            <Select value={value.status} options={optionsOf(STATUSES)} onChange={(status) => update({ status })} />
          </Field>
          <Field label="Актуальность">
            <Select value={value.relevance} options={optionsOf(RELEVANCE)} onChange={(relevance) => update({ relevance })} />
          </Field>
          <Field label="Дата принятия"><DatePicker ariaLabel="Дата принятия" value={value.adoptedAt || ''} onChange={(adoptedAt) => update({ adoptedAt })} /></Field>
          <Field label="Дата публикации"><DatePicker ariaLabel="Дата публикации" value={value.publishedAt || ''} onChange={(publishedAt) => update({ publishedAt })} /></Field>
          <Field label="Дата следующей проверки"><DatePicker ariaLabel="Дата следующей проверки" value={value.nextCheckAt || ''} onChange={(nextCheckAt) => update({ nextCheckAt })} /></Field>
          <Field label="Орган управления, принявший документ"><input value={value.governingBody} onChange={(event) => update({ governingBody: event.target.value })} /></Field>
          <Field label="Вид документа принятия"><input value={value.adoptionDocKind} onChange={(event) => update({ adoptionDocKind: event.target.value })} /></Field>
          <Field label="Реквизиты документа принятия"><input value={value.adoptionDocDetails} onChange={(event) => update({ adoptionDocDetails: event.target.value })} /></Field>
          <Field label="Ключевые слова" hint="Через запятую, по ним тоже ищет реестр">
            <input value={(value.keywords ?? []).join(', ')} onChange={(event) => update({ keywords: event.target.value.split(',').map((item) => item.trim()) })} />
          </Field>
        </div>
      </section>

      <section className={styles.block}>
        <h2>Владельцы</h2>
        <div className={styles.grid}>
          <Field label="Владелец ВНД">
            <Select placeholder="Не назначен" clearable value={value.ownerDeptId} options={optionsOf(DEPARTMENTS, 'name')} onChange={(ownerDeptId) => update({ ownerDeptId })} />
          </Field>
          <Field label="Владелец процесса">
            <Select placeholder="Не назначен" clearable value={value.processOwnerDeptId} options={optionsOf(DEPARTMENTS, 'name')} onChange={(processOwnerDeptId) => update({ processOwnerDeptId })} />
          </Field>
          <Field label="Ответственный"><input value={value.responsible} onChange={(event) => update({ responsible: event.target.value })} /></Field>
        </div>
      </section>

      <section className={styles.block}>
        <h2>Редакции и файлы</h2>
        {fileError ? <p className={styles.error}>{fileError}</p> : null}
        <label className={styles.checks}>
          <input type="checkbox" checked={value.overlapConfirmed} onChange={(event) => update({ overlapConfirmed: event.target.checked })} />
          Пересечение периодов подтверждаю
        </label>
        {value.revisions.map((revision) => (
          <div key={revision.id} className={styles.row}>
            <Field label="Номер редакции"><input type="number" value={revision.number} onChange={(event) => updateRevision(revision.id, { number: Number(event.target.value) })} /></Field>
            <Field label="Действует с"><DatePicker ariaLabel="Действует с" value={revision.effectiveFrom || ''} onChange={(effectiveFrom) => updateRevision(revision.id, { effectiveFrom })} /></Field>
            <Field label="Действует по"><DatePicker ariaLabel="Действует по" value={revision.effectiveTo || ''} onChange={(effectiveTo) => updateRevision(revision.id, { effectiveTo })} /></Field>
            <Field label="Дата публикации редакции"><DatePicker ariaLabel="Дата публикации редакции" value={revision.publishedAt || ''} onChange={(publishedAt) => updateRevision(revision.id, { publishedAt })} /></Field>
            <Field label="Основание"><input value={revision.basisDetails || ''} onChange={(event) => updateRevision(revision.id, { basisDetails: event.target.value })} /></Field>
            <div className={styles.checks}>
              <label><input type="checkbox" checked={revision.confirmedStart} onChange={(event) => updateRevision(revision.id, { confirmedStart: event.target.checked })} /> Начало подтверждено</label>
              <label><input type="checkbox" checked={revision.isSubstantive} onChange={(event) => updateRevision(revision.id, { isSubstantive: event.target.checked })} /> Содержательная</label>
              <label><input type="checkbox" checked={revision.incomplete} onChange={(event) => updateRevision(revision.id, { incomplete: event.target.checked })} /> Неполная запись</label>
            </div>
            <Field label="Причина неполноты"><input value={revision.incompleteReason || ''} onChange={(event) => updateRevision(revision.id, { incompleteReason: event.target.value })} /></Field>
            <Field label="Основной файл" hint={revision.file?.name || 'PDF, DOCX, Excel или изображение до 50 МБ'}>
              <input type="file" onChange={(event) => attach(revision.id, 'file', event.target.files?.[0])} />
            </Field>
            <Field label="Файл основания" hint={revision.basisFile?.name || 'Обязателен для полной редакции'}>
              <input type="file" onChange={(event) => attach(revision.id, 'basisFile', event.target.files?.[0])} />
            </Field>
            {revision.locked ? <p>Опубликованная редакция не удаляется.</p> : (
              <Button variant="ghost" onClick={() => update({ revisions: withoutItem(value.revisions, revision.id) })}>Удалить редакцию</Button>
            )}
          </div>
        ))}
        <Button variant="secondary" onClick={() => update({ revisions: [...value.revisions, blankRevision(value.revisions.length + 1)] })}>Добавить редакцию</Button>
      </section>

      <section className={styles.block}>
        <h2>Актуализация</h2>
        {(value.relevanceEvents ?? []).map((event) => (
          <div key={event.id} className={styles.row}>
            <Field label="Дата">
              <DatePicker ariaLabel="Дата события" value={event.date || ''} onChange={(date) => update({ relevanceEvents: withItem(value.relevanceEvents, event.id, { date }) })} />
            </Field>
            <Field label="Событие">
              <Select value={event.type} options={optionsOf(RELEVANCE_EVENT_TYPES)} onChange={(type) => update({ relevanceEvents: withItem(value.relevanceEvents, event.id, { type }) })} />
            </Field>
            <Field label="Кто проверил"><input value={event.checker || ''} onChange={(eventInput) => update({ relevanceEvents: withItem(value.relevanceEvents, event.id, { checker: eventInput.target.value }) })} /></Field>
            <Field label="Комментарий"><input value={event.comment || ''} onChange={(eventInput) => update({ relevanceEvents: withItem(value.relevanceEvents, event.id, { comment: eventInput.target.value }) })} /></Field>
            <label><input type="checkbox" checked={Boolean(event.completed)} onChange={(eventInput) => update({ relevanceEvents: withItem(value.relevanceEvents, event.id, { completed: eventInput.target.checked }) })} /> Выполнено</label>
            {event.locked ? null : <Button variant="ghost" onClick={() => update({ relevanceEvents: withoutItem(value.relevanceEvents, event.id) })}>Удалить</Button>}
          </div>
        ))}
        <Button variant="secondary" onClick={() => update({ relevanceEvents: [...(value.relevanceEvents ?? []), { id: crypto.randomUUID(), date: '', type: 'planned_check', completed: false, checker: '', comment: '', locked: false }] })}>Добавить событие</Button>
      </section>

      <section className={styles.block}>
        <h2>Связь с функцией</h2>
        {(value.functionLinks ?? []).map((link) => (
          <div key={`${link.functionId}-${link.role}`} className={styles.row}>
            <Field label="Функция">
              <Select disabled={link.locked} value={link.functionId} options={optionsOf(FUNCTIONS, 'name')} onChange={(functionId) => update({ functionLinks: value.functionLinks.map((item) => item === link ? { ...item, functionId } : item) })} />
            </Field>
            <Field label="Роль">
              <Select disabled={link.locked} value={link.role} options={optionsOf(FUNCTION_ROLES)} onChange={(role) => update({ functionLinks: value.functionLinks.map((item) => item === link ? { ...item, role } : item) })} />
            </Field>
            {link.locked ? null : <Button variant="ghost" onClick={() => update({ functionLinks: value.functionLinks.filter((item) => item !== link) })}>Удалить</Button>}
          </div>
        ))}
        <Button variant="secondary" onClick={() => update({ functionLinks: [...(value.functionLinks ?? []), { functionId: FUNCTIONS[0].id, role: 'executes', locked: false }] })}>Добавить функцию</Button>
      </section>

      <section className={styles.block}>
        <h2>Связь с ВНД</h2>
        {(value.documentLinks ?? []).map((link) => (
          <div key={link.id} className={styles.row}>
            <Field label="Документ">
              <Select
                disabled={link.locked}
                placeholder="Выберите"
                clearable
                value={link.targetId}
                options={others.map((document) => ({ id: document.id, label: `${document.number} ${document.shortTitle}` }))}
                onChange={(targetId) => update({ documentLinks: withItem(value.documentLinks, link.id, { targetId }) })}
              />
            </Field>
            <Field label="Редакция"><input type="number" value={link.targetRevision ?? ''} disabled={link.locked} onChange={(event) => update({ documentLinks: withItem(value.documentLinks, link.id, { targetRevision: Number(event.target.value) }) })} /></Field>
            <Field label="Роль">
              <Select disabled={link.locked} value={link.role} options={optionsOf(VND_LINK_ROLES)} onChange={(role) => update({ documentLinks: withItem(value.documentLinks, link.id, { role }) })} />
            </Field>
            {link.locked ? null : <Button variant="ghost" onClick={() => update({ documentLinks: withoutItem(value.documentLinks, link.id) })}>Удалить</Button>}
          </div>
        ))}
        <Button variant="secondary" onClick={() => update({ documentLinks: [...(value.documentLinks ?? []), { id: crypto.randomUUID(), targetId: '', targetRevision: 1, role: 'references', locked: false }] })}>Добавить связь</Button>
      </section>
    </form>
  )
}
