import styles from './Chip.module.css'
import { REMOVE_LABEL } from '../model/labels.js'

export function Chip({ children, onRemove }) {
  return (
    <span className={styles.chip}>
      {children}
      {onRemove ? (
        <button type="button" onClick={onRemove} aria-label={REMOVE_LABEL}>×</button>
      ) : null}
    </span>
  )
}
