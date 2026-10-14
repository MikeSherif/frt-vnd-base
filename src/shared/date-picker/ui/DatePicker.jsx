import { useEffect, useId, useRef, useState } from 'react'
import { displayDate, inMonth, monthDays, monthTitle, parseIsoDate, sameDay, shiftMonth, toIso, WEEKDAYS } from '../model/calendar.js'
import styles from './DatePicker.module.css'

export function DatePicker({
  value,
  onChange,
  placeholder = 'дд.мм.гггг',
  ariaLabel,
  disabled = false,
  compact = false,
}) {
  const [open, setOpen] = useState(false)
  const [cursor, setCursor] = useState(() => parseIsoDate(value) ?? new Date())
  const rootRef = useRef(null)
  const listId = useId()
  const selected = parseIsoDate(value)
  const today = new Date()

  useEffect(() => {
    if (!open) return undefined
    function onPointer(event) {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    function onKey(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function toggle() {
    setCursor(parseIsoDate(value) ?? new Date())
    setOpen((current) => !current)
  }

  return (
    <div className={[styles.root, compact ? styles.compact : ''].filter(Boolean).join(' ')} ref={rootRef}>
      <div className={styles.control}>
        <button
          type="button"
          className={styles.face}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls={listId}
          onClick={toggle}
        >
          <span className={value ? styles.value : styles.placeholder}>{displayDate(value) || placeholder}</span>
          <span className={styles.icon} aria-hidden="true" />
        </button>
        {value ? (
          <button type="button" className={styles.clear} aria-label="Очистить дату" disabled={disabled} onClick={() => onChange('')}>
            ×
          </button>
        ) : null}
      </div>
      {open ? (
        <div id={listId} className={styles.popup} role="dialog" aria-label={ariaLabel || 'Календарь'}>
          <div className={styles.head}>
            <button type="button" className={styles.nav} onClick={() => setCursor((date) => shiftMonth(date, -1))} aria-label="Предыдущий месяц">‹</button>
            <span>{monthTitle(cursor)}</span>
            <button type="button" className={styles.nav} onClick={() => setCursor((date) => shiftMonth(date, 1))} aria-label="Следующий месяц">›</button>
          </div>
          <div className={styles.week}>
            {WEEKDAYS.map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className={styles.grid}>
            {monthDays(cursor).map((day) => {
              const iso = toIso(day)
              const active = sameDay(day, selected)
              const className = [
                styles.day,
                inMonth(day, cursor) ? '' : styles.outside,
                sameDay(day, today) ? styles.today : '',
                active ? styles.active : '',
              ].filter(Boolean).join(' ')
              return (
                <button key={iso} type="button" className={className} onClick={() => { onChange(iso); setOpen(false) }}>
                  {day.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
