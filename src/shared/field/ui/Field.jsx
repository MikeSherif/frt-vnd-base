import styles from './Field.module.css'
import { describedBy } from '../model/describedBy.js'

export function Field({ label, hint, children, className = '' }) {
  const hintId = hint ? `hint-${label}` : undefined
  return (
    <label className={[styles.field, className].filter(Boolean).join(' ')}>
      <span>{label}</span>
      {children}
      {hint ? <small id={describedBy(hint, hintId)}>{hint}</small> : null}
    </label>
  )
}
