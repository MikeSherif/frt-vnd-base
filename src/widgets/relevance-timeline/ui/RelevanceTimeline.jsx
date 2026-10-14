import { DateText } from '../../../shared/date-text'
import { eventLabel, timelineEvents } from '../model/timelineEvents.js'
import styles from './RelevanceTimeline.module.css'

export function RelevanceTimeline({ events }) {
  const items = timelineEvents(events ?? [])
  return (
    <section className={styles.card}>
      <h2>Актуальность</h2>
      {items.length === 0 ? <p>История актуализации пока не заполнена.</p> : (
        <ol className={styles.list}>
          {items.map((event) => (
            <li key={event.id} className={event.completed ? styles.done : styles.future} title={[event.checker, event.comment].filter(Boolean).join('. ')}>
              <DateText value={event.date} />
              <span>{eventLabel(event.type)}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
