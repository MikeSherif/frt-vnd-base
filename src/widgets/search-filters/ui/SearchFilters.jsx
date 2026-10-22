import { useEffect, useRef, useState } from 'react'
import { Chip } from '../../../shared/chip'
import { DatePicker } from '../../../shared/date-picker'
import { Field } from '../../../shared/field'
import { Select } from '../../../shared/select'
import { buildChips, DEPARTMENTS, DOCUMENT_KINDS, FUNCTIONS, RELEVANCE, STATUSES } from '../model/buildChips.js'
import styles from './SearchFilters.module.css'

const EMPTY_FIELDS = {
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
}

function asOptions(list, labelKey = 'label') {
  return list.map((item) => ({ id: item.id, label: item[labelKey] }))
}

function FilterField({ label, children }) {
  return (
    <Field label={label} control="composite">
      {(a11y) => children({
        labelledBy: a11y.labelledBy,
        describedBy: a11y.describedBy,
        invalid: a11y.invalid,
      })}
    </Field>
  )
}

function FilterReveal({ open, children }) {
  const [present, setPresent] = useState(false)
  const [settled, setSettled] = useState(false)
  const node = useRef(null)
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!open) return undefined
    setPresent(true)
    setSettled(reduced())
    return undefined
  }, [open])

  useEffect(() => {
    if (open || !present || !reduced()) return undefined
    setPresent(false)
    setSettled(false)
    return undefined
  }, [open, present])

  if (!present) return null

  return (
    <div
      ref={node}
      className={[styles.reveal, open ? styles.revealIn : styles.revealOut, settled ? styles.revealSettled : ''].filter(Boolean).join(' ')}
      onAnimationEnd={(event) => {
        if (event.target !== node.current) return
        if (open) setSettled(true)
        else {
          setPresent(false)
          setSettled(false)
        }
      }}
    >
      <div className={styles.revealClip}>{children}</div>
    </div>
  )
}

export function SearchFilters({ filters, onChange, leading, trailing }) {
  const [open, setOpen] = useState(false)
  const chips = buildChips(filters)
  const filterCount = chips.filter((chip) => chip.id !== 'q' && chip.id !== 'preset').length

  return (
    <div className={styles.tools}>
      <div className={styles.toolbar}>
        {leading}
        <div
          className={styles.search}
          onMouseDown={(event) => {
            if (event.target.closest('button, input')) return
            event.preventDefault()
            event.currentTarget.querySelector('input')?.focus()
          }}
        >
          <span className={styles.lens} aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <input
            value={filters.q}
            placeholder="Название, номер, статус, функция"
            onChange={(event) => onChange({ q: event.target.value })}
            aria-label="Поиск"
          />
          <button
            type="button"
            className={open || filterCount ? styles.filterOn : styles.filter}
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label="Фильтр"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M2 3.5h12l-4.5 5.2V13l-3-1.4V8.7L2 3.5z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
            </svg>
            {filterCount ? <span className={styles.badge}>{filterCount}</span> : null}
          </button>
          {filters.q ? (
            <button type="button" className={styles.clear} onClick={() => onChange({ q: '' })} aria-label="Очистить поиск">×</button>
          ) : null}
        </div>
        <div className={styles.trailing}>{trailing}</div>
      </div>
      <FilterReveal open={open}>
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <span>Фильтр</span>
            <button type="button" onClick={() => onChange(EMPTY_FIELDS)}>Очистить</button>
          </div>
          <FilterField label="Статус">
            {(field) => <Select {...field} multiple placeholder="Все статусы" value={filters.status} options={asOptions(STATUSES)} onChange={(status) => onChange({ status })} />}
          </FilterField>
          <FilterField label="Актуальность">
            {(field) => <Select {...field} multiple placeholder="Любая" value={filters.relevance} options={asOptions(RELEVANCE)} onChange={(relevance) => onChange({ relevance })} />}
          </FilterField>
          <FilterField label="Функция">
            {(field) => <Select {...field} multiple placeholder="Все функции" value={filters.functionIds} options={asOptions(FUNCTIONS, 'name')} onChange={(functionIds) => onChange({ functionIds })} />}
          </FilterField>
          <FilterField label="Вид ВНД">
            {(field) => <Select {...field} multiple placeholder="Все виды" value={filters.kind} options={asOptions(DOCUMENT_KINDS)} onChange={(kind) => onChange({ kind })} />}
          </FilterField>
          <FilterField label="Владелец ВНД">
            {(field) => <Select {...field} multiple placeholder="Все подразделения" value={filters.owner} options={asOptions(DEPARTMENTS, 'name')} onChange={(owner) => onChange({ owner })} />}
          </FilterField>
          <FilterField label="Владелец процесса">
            {(field) => <Select {...field} multiple placeholder="Все подразделения" value={filters.processOwner} options={asOptions(DEPARTMENTS, 'name')} onChange={(processOwner) => onChange({ processOwner })} />}
          </FilterField>
          <FilterField label="Принят с">
            {(field) => <DatePicker {...field} ariaLabel="Принят с" value={filters.adoptedFrom} onChange={(adoptedFrom) => onChange({ adoptedFrom })} />}
          </FilterField>
          <FilterField label="Принят по">
            {(field) => <DatePicker {...field} ariaLabel="Принят по" value={filters.adoptedTo} onChange={(adoptedTo) => onChange({ adoptedTo })} />}
          </FilterField>
          <FilterField label="Действовал на дату">
            {(field) => <DatePicker {...field} ariaLabel="Действовал на дату" value={filters.onDate} onChange={(onDate) => onChange({ onDate })} />}
          </FilterField>
          <FilterField label="Опубликован с">
            {(field) => <DatePicker {...field} ariaLabel="Опубликован с" value={filters.publishedFrom} onChange={(publishedFrom) => onChange({ publishedFrom })} />}
          </FilterField>
          <FilterField label="Опубликован по">
            {(field) => <DatePicker {...field} ariaLabel="Опубликован по" value={filters.publishedTo} onChange={(publishedTo) => onChange({ publishedTo })} />}
          </FilterField>
        </div>
      </FilterReveal>
      {chips.length ? (
        <div className={styles.chips}>
          {chips.map((chip) => (
            <Chip key={chip.id} onRemove={() => onChange(chip.patch)}>{chip.label}</Chip>
          ))}
        </div>
      ) : null}
    </div>
  )
}
