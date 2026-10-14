import { ABOUT_NOTE } from '../model/aboutNote.js'
import styles from './AboutDocument.module.css'

export function AboutDocument({ summary, keywords }) {
  return (
    <section className={styles.card} title={ABOUT_NOTE}>
      <h2>О документе</h2>
      <p><span>Краткое описание:</span> {summary || 'Описание пока не заполнено.'}</p>
      <p><span>Ключевые слова:</span> {keywords?.length ? keywords.join(', ') : 'не указаны'}</p>
    </section>
  )
}
