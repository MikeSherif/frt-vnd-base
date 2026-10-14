import styles from './EmptyState.module.css'
import { EMPTY_DOCUMENT_TEXT } from '../model/emptyText.js'

export function EmptyState({ title = EMPTY_DOCUMENT_TEXT, action }) {
  return (
    <div className={styles.box}>
      <p>{title}</p>
      {action}
    </div>
  )
}
