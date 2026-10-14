import { labelOf, RELEVANCE, STATUSES } from '../model/dictionaries.js'
import styles from './DocumentMarks.module.css'

export function DocumentMarks({ status, relevance }) {
  return (
    <>
      {status ? <span className={`${styles.mark} ${styles[status]}`}>{labelOf(STATUSES, status)}</span> : null}
      {relevance ? <span className={`${styles.mark} ${styles[relevance]}`}>{labelOf(RELEVANCE, relevance)}</span> : null}
    </>
  )
}
