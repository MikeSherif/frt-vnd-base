import { useId } from 'react'
import { fieldDescribedBy } from '../model/fieldDescribedBy.js'
import styles from './Field.module.css'

export function Field({ label, hint, error, children, className = '', control = 'text' }) {
  const uid = useId()
  const inputId = `${uid}-control`
  const labelId = `${uid}-label`
  const hintId = hint ? `${uid}-hint` : undefined
  const errorId = error ? `${uid}-error` : undefined
  const describedBy = fieldDescribedBy(hint, error, hintId, errorId)
  const composite = control === 'composite'
  const a11y = {
    id: inputId,
    labelledBy: labelId,
    invalid: Boolean(error),
    describedBy,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
  }

  return (
    <div className={[styles.field, className].filter(Boolean).join(' ')}>
      {composite ? (
        <span className={styles.label} id={labelId}>{label}</span>
      ) : (
        <label className={styles.label} id={labelId} htmlFor={inputId}>{label}</label>
      )}
      {typeof children === 'function' ? children(a11y) : children}
      {hint ? <small className={styles.hint} id={hintId}>{hint}</small> : null}
      {error ? <small className={styles.error} id={errorId}>{error}</small> : null}
    </div>
  )
}
