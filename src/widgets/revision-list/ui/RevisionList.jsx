import { periodLabel } from '../model/periodLabel.js'
import { sortRevisions } from '../model/sortRevisions.js'
import styles from './RevisionList.module.css'

export function RevisionList({ revisions, currentId, selectedId, documentStatus, onSelect }) {
  return (
    <section className={styles.card}>
      <h2>Редакции</h2>
      <ul className={styles.list}>
        {sortRevisions(revisions).map((revision) => {
          const acting = revision.id === currentId && documentStatus !== 'archived'
          const selected = revision.id === selectedId
          const className = [acting ? styles.actual : styles.past, selected ? styles.selected : ''].filter(Boolean).join(' ')
          return (
            <li key={revision.id} className={className}>
              <button type="button" onClick={() => onSelect(revision.id)}>
                <span>{periodLabel(revision, acting)}</span>
                <span>ред. {revision.number}</span>
                <span>{acting ? 'Действует' : 'Архив'}</span>
              </button>
              {revision.file?.url ? (
                <a href={revision.file.url} download={revision.file.name} aria-label={`Скачать редакцию ${revision.number}`}>▾</a>
              ) : <span />}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
