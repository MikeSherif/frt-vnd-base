import { Link } from 'react-router-dom'
import { TEMPLATE_URL } from '../model/links.js'
import { SubscribeButton } from '../../../features/subscribe'
import styles from './PortalLinks.module.css'

export function PortalLinks() {
  return (
    <nav className={styles.row} aria-label="Смежные разделы">
      <Link to="/duties">Распределение обязанностей</Link>
      <span className={styles.sep}>|</span>
      <Link to="/functions">Каталог функций</Link>
      <span className={styles.sep}>|</span>
      <a href={TEMPLATE_URL} target="_blank" rel="noreferrer">Шаблоны</a>
      <span className={styles.sep}>|</span>
      <SubscribeButton target="section" appearance="link" />
    </nav>
  )
}
