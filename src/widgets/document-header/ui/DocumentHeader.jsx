import { Link } from 'react-router-dom'
import { FavoriteButton } from '../../../features/toggle-favorite'
import { SubscribeButton } from '../../../features/subscribe'
import { headerFacts } from '../model/headerFacts.js'
import styles from './DocumentHeader.module.css'

export function DocumentHeader({ document, revision, file, onBack, editTo }) {
  return (
    <header className={styles.wrap}>
      <button type="button" className={styles.back} onClick={onBack}>← Назад</button>
      <div className={styles.top}>
        <h2>
          {document.fullTitle}
          <FavoriteButton documentId={document.id} plain />
        </h2>
        <div className={styles.links}>
          <SubscribeButton target={document.id} label="Подписаться" appearance="link" />
          {file?.url ? <a href={file.url} download={file.name}>Скачать</a> : null}
          {editTo ? <Link to={editTo}>Редактировать</Link> : null}
        </div>
      </div>
      <p className={styles.kicker}>Общая информация</p>
      <dl className={styles.facts}>
        {headerFacts(document, revision).map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </header>
  )
}
