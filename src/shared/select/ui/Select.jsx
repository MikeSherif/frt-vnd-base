import { useEffect, useId, useRef, useState } from 'react'
import { isSelected, nextValue, selectionLabel } from '../model/selection.js'
import styles from './Select.module.css'

export function Select({
  value,
  options,
  onChange,
  multiple = false,
  placeholder = 'Не выбрано',
  ariaLabel,
  disabled = false,
  clearable = false,
  compact = false,
  menuPlacement = 'bottom',
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const listId = useId()
  const label = selectionLabel(options, value, multiple, placeholder)
  const empty = multiple ? !(value ?? []).length : value === '' || value == null

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

  function choose(id) {
    onChange(nextValue(value, id, multiple))
    if (!multiple) setOpen(false)
  }

  return (
    <div className={[styles.root, compact ? styles.compact : ''].filter(Boolean).join(' ')} ref={rootRef}>
      <div className={styles.control}>
        <button
          type="button"
          className={styles.face}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((current) => !current)}
        >
          <span className={empty ? styles.placeholder : styles.value}>{label}</span>
          <span className={styles.chevron} aria-hidden="true" />
        </button>
        {clearable && !empty ? (
          <button
            type="button"
            className={styles.clear}
            aria-label="Очистить"
            disabled={disabled}
            onClick={() => onChange(multiple ? [] : '')}
          >
            ×
          </button>
        ) : null}
      </div>
      {open ? (
        <ul id={listId} className={menuPlacement === 'top' ? styles.menuTop : styles.menu} role="listbox" aria-multiselectable={multiple || undefined}>
          {options.map((option) => {
            const selected = isSelected(value, option.id, multiple)
            return (
              <li key={option.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={selected ? styles.optionOn : styles.option}
                  onClick={() => choose(option.id)}
                >
                  {multiple ? <span className={selected ? styles.boxOn : styles.box} /> : null}
                  <span>{option.label}</span>
                </button>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}
