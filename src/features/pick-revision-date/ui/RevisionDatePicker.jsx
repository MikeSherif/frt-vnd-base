import { formatDate } from '../../../shared/date-text'
import { DatePicker } from '../../../shared/date-picker'
import { groundsText } from '../model/groundsText.js'
import styles from './RevisionDatePicker.module.css'

export function RevisionDatePicker({ value, onChange, resolution }) {
  const revision = resolution?.revision
  return (
    <div className={styles.box}>
      <span>Редакция на дату</span>
      <DatePicker
        compact
        ariaLabel="Редакция на дату"
        value={value}
        onChange={onChange}
      />
      {resolution?.reason ? <span className={styles.reason}>{resolution.reason}</span> : null}
      {revision ? <span className={styles.grounds}>{groundsText(revision, formatDate)}</span> : null}
    </div>
  )
}
