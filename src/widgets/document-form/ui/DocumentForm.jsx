import { useState } from 'react'
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
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
import { readFileMeta } from '../model/readFileMeta.js'
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

function inputProps(field) {
  return {
    id: field.id,
    'aria-invalid': field['aria-invalid'],
    'aria-describedby': field['aria-describedby'],
  }
}

function compositeProps(field) {
  return {
    labelledBy: field.labelledBy,
    describedBy: field.describedBy,
    invalid: field.invalid,
  }
}

function TextInput({ label, hint, name, type = 'text', error, disabled = false, className = '', rules }) {
  const { register } = useFormContext()
  return (
    <Field className={className} label={label} hint={hint} error={error}>
      {(field) => (
        <input
          {...register(name, rules)}
          {...inputProps(field)}
          type={type}
          disabled={disabled}
        />
      )}
    </Field>
  )
}

function SelectInput({ label, name, options, error, disabled = false, placeholder, clearable = false }) {
  const { control } = useFormContext()
  return (
    <Field label={label} error={error} control="composite">
      {(field) => (
        <Controller
          name={name}
          control={control}
          render={({ field: input }) => (
            <Select
              {...compositeProps(field)}
              placeholder={placeholder}
              clearable={clearable}
              disabled={disabled}
              value={input.value ?? ''}
              options={options}
              onChange={input.onChange}
            />
          )}
        />
      )}
    </Field>
  )
}

function DateInput({ label, name, error }) {
  const { control } = useFormContext()
  return (
    <Field label={label} error={error} control="composite">
      {(field) => (
        <Controller
          name={name}
          control={control}
          render={({ field: input }) => (
            <DatePicker
              {...compositeProps(field)}
              ariaLabel={label}
              value={input.value || ''}
              onChange={input.onChange}
            />
          )}
        />
      )}
    </Field>
  )
}

function FileInput({ label, hint, error, name, onPick }) {
  return (
    <Field className={styles.fileField} label={label} hint={hint} error={error}>
      {(field) => (
        <span className={styles.file}>
          <input
            {...inputProps(field)}
            type="file"
            onChange={(event) => onPick(event.target.files?.[0])}
          />
          <span className={styles.fileBtn}>Выбрать файл</span>
          <span className={name ? styles.fileName : styles.fileEmpty}>{name || 'Файл не выбран'}</span>
        </span>
      )}
    </Field>
  )
}

export function DocumentForm({ documents }) {
  const { control, register, setValue, formState: { errors } } = useFormContext()
  const [fileError, setFileError] = useState('')
  const revisions = useWatch({ control, name: 'revisions' })
  const events = useWatch({ control, name: 'relevanceEvents' })
  const functionLinks = useWatch({ control, name: 'functionLinks' })
  const documentLinks = useWatch({ control, name: 'documentLinks' })
  const documentId = useWatch({ control, name: 'id' })
  const revisionFields = useFieldArray({ control, name: 'revisions', keyName: 'fieldKey' })
  const eventFields = useFieldArray({ control, name: 'relevanceEvents', keyName: 'fieldKey' })
  const functionFields = useFieldArray({ control, name: 'functionLinks', keyName: 'fieldKey' })
  const linkFields = useFieldArray({ control, name: 'documentLinks', keyName: 'fieldKey' })
  const others = documents.filter((document) => document.id !== documentId && document.published)
  const numberRule = { setValueAs: (value) => (value === '' || value == null ? 0 : Number(value)) }

  async function attach(index, key, file) {
    if (!file) return
    setFileError('')
    try {
      setValue(`revisions.${index}.${key}`, await readFileMeta(file), { shouldDirty: true })
    } catch (error) {
      setFileError(error.message)
    }
  }

  return (
    <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
      <section className={styles.block}>
        <h2>Реквизиты</h2>
        <div className={styles.grid}>
          <TextInput label="Краткое наименование" name="shortTitle" error={errors.shortTitle?.message} />
          <TextInput label="Номер ВНД" name="number" error={errors.number?.message} />
          <TextInput label="Полное наименование" name="fullTitle" className={styles.wide} error={errors.fullTitle?.message} />
          <SelectInput label="Вид документа" name="kind" placeholder="Выберите" clearable options={optionsOf(DOCUMENT_KINDS)} error={errors.kind?.message} />
          <SelectInput label="Статус" name="status" options={optionsOf(STATUSES)} error={errors.status?.message} />
          <SelectInput label="Актуальность" name="relevance" options={optionsOf(RELEVANCE)} error={errors.relevance?.message} />
          <DateInput label="Дата принятия" name="adoptedAt" error={errors.adoptedAt?.message} />
          <DateInput label="Дата публикации" name="publishedAt" error={errors.publishedAt?.message} />
          <DateInput label="Дата следующей проверки" name="nextCheckAt" error={errors.nextCheckAt?.message} />
          <TextInput label="Орган управления, принявший документ" name="governingBody" />
          <TextInput label="Вид документа принятия" name="adoptionDocKind" />
          <TextInput label="Реквизиты документа принятия" name="adoptionDocDetails" />
          <Field label="Ключевые слова" hint="Через запятую, по ним тоже ищет реестр" error={errors.keywords?.message}>
            {(field) => (
              <Controller
                name="keywords"
                control={control}
                render={({ field: input }) => (
                  <input
                    {...inputProps(field)}
                    value={(input.value ?? []).join(', ')}
                    onChange={(event) => input.onChange(event.target.value.split(',').map((item) => item.trim()))}
                    onBlur={input.onBlur}
                  />
                )}
              />
            )}
          </Field>
        </div>
      </section>

      <section className={styles.block}>
        <h2>Владельцы</h2>
        <div className={styles.grid}>
          <SelectInput label="Владелец ВНД" name="ownerDeptId" placeholder="Не назначен" clearable options={optionsOf(DEPARTMENTS, 'name')} error={errors.ownerDeptId?.message} />
          <SelectInput label="Владелец процесса" name="processOwnerDeptId" placeholder="Не назначен" clearable options={optionsOf(DEPARTMENTS, 'name')} />
          <TextInput label="Ответственный" name="responsible" error={errors.responsible?.message} />
        </div>
      </section>

      <section className={styles.block}>
        <h2>Редакции и файлы</h2>
        {fileError ? <p className={styles.error}>{fileError}</p> : null}
        {errors.root?.mainFile?.message ? <p className={styles.error}>{errors.root.mainFile.message}</p> : null}
        <label className={styles.checks}>
          <input type="checkbox" aria-invalid={errors.overlapConfirmed ? true : undefined} {...register('overlapConfirmed')} />
          Пересечение периодов подтверждаю
        </label>
        {errors.overlapConfirmed?.message ? <p className={styles.error}>{errors.overlapConfirmed.message}</p> : null}
        {revisionFields.fields.map((field, index) => {
          const revision = revisions?.[index] ?? {}
          const revisionErrors = errors.revisions?.[index] ?? {}
          return (
            <div key={field.fieldKey} className={styles.row}>
              <TextInput label="Номер редакции" name={`revisions.${index}.number`} type="number" rules={numberRule} />
              <DateInput label="Действует с" name={`revisions.${index}.effectiveFrom`} />
              <DateInput label="Действует по" name={`revisions.${index}.effectiveTo`} error={revisionErrors.effectiveTo?.message} />
              <DateInput label="Дата публикации редакции" name={`revisions.${index}.publishedAt`} />
              <TextInput label="Основание" name={`revisions.${index}.basisDetails`} />
              <div className={styles.checks}>
                <label><input type="checkbox" {...register(`revisions.${index}.confirmedStart`)} /> Начало подтверждено</label>
                <label><input type="checkbox" {...register(`revisions.${index}.isSubstantive`)} /> Содержательная</label>
                <label><input type="checkbox" {...register(`revisions.${index}.incomplete`)} /> Неполная запись</label>
              </div>
              <TextInput label="Причина неполноты" name={`revisions.${index}.incompleteReason`} error={revisionErrors.incompleteReason?.message} />
              <FileInput
                label="Основной файл"
                hint="PDF, DOCX, Excel или изображение до 50 МБ"
                name={revision.file?.name}
                error={revisionErrors.file?.message}
                onPick={(file) => attach(index, 'file', file)}
              />
              <FileInput
                label="Файл основания"
                hint="Обязателен для полной редакции"
                name={revision.basisFile?.name}
                error={revisionErrors.basisFile?.message}
                onPick={(file) => attach(index, 'basisFile', file)}
              />
              {revision.locked ? <p>Опубликованная редакция не удаляется.</p> : (
                <Button variant="ghost" onClick={() => revisionFields.remove(index)}>Удалить редакцию</Button>
              )}
            </div>
          )
        })}
        <Button variant="secondary" onClick={() => revisionFields.append(blankRevision((revisions?.length ?? 0) + 1))}>Добавить редакцию</Button>
      </section>

      <section className={styles.block}>
        <h2>Актуализация</h2>
        {eventFields.fields.map((field, index) => {
          const event = events?.[index] ?? {}
          return (
            <div key={field.fieldKey} className={styles.row}>
              <DateInput label="Дата" name={`relevanceEvents.${index}.date`} />
              <SelectInput label="Событие" name={`relevanceEvents.${index}.type`} options={optionsOf(RELEVANCE_EVENT_TYPES)} />
              <TextInput label="Кто проверил" name={`relevanceEvents.${index}.checker`} />
              <TextInput label="Комментарий" name={`relevanceEvents.${index}.comment`} />
              <label><input type="checkbox" {...register(`relevanceEvents.${index}.completed`)} /> Выполнено</label>
              {event.locked ? null : <Button variant="ghost" onClick={() => eventFields.remove(index)}>Удалить</Button>}
            </div>
          )
        })}
        <Button
          variant="secondary"
          onClick={() => eventFields.append({ id: crypto.randomUUID(), date: '', type: 'planned_check', completed: false, checker: '', comment: '', locked: false })}
        >
          Добавить событие
        </Button>
      </section>

      <section className={styles.block}>
        <h2>Связь с функцией</h2>
        {functionFields.fields.map((field, index) => {
          const link = functionLinks?.[index] ?? {}
          return (
            <div key={field.fieldKey} className={styles.row}>
              <SelectInput label="Функция" name={`functionLinks.${index}.functionId`} disabled={link.locked} options={optionsOf(FUNCTIONS, 'name')} />
              <SelectInput label="Роль" name={`functionLinks.${index}.role`} disabled={link.locked} options={optionsOf(FUNCTION_ROLES)} />
              {link.locked ? null : <Button variant="ghost" onClick={() => functionFields.remove(index)}>Удалить</Button>}
            </div>
          )
        })}
        <Button variant="secondary" onClick={() => functionFields.append({ functionId: FUNCTIONS[0].id, role: 'executes', locked: false })}>Добавить функцию</Button>
      </section>

      <section className={styles.block}>
        <h2>Связь с ВНД</h2>
        {linkFields.fields.map((field, index) => {
          const link = documentLinks?.[index] ?? {}
          return (
            <div key={field.fieldKey} className={styles.row}>
              <SelectInput
                label="Документ"
                name={`documentLinks.${index}.targetId`}
                disabled={link.locked}
                placeholder="Выберите"
                clearable
                options={others.map((document) => ({ id: document.id, label: `${document.number} ${document.shortTitle}` }))}
              />
              <TextInput label="Редакция" name={`documentLinks.${index}.targetRevision`} type="number" rules={numberRule} disabled={link.locked} />
              <SelectInput label="Роль" name={`documentLinks.${index}.role`} disabled={link.locked} options={optionsOf(VND_LINK_ROLES)} />
              {link.locked ? null : <Button variant="ghost" onClick={() => linkFields.remove(index)}>Удалить</Button>}
            </div>
          )
        })}
        <Button
          variant="secondary"
          onClick={() => linkFields.append({ id: crypto.randomUUID(), targetId: '', targetRevision: 1, role: 'references', locked: false })}
        >
          Добавить связь
        </Button>
      </section>
    </form>
  )
}
