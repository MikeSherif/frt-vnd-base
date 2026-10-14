import { Link } from 'react-router-dom'
import styles from './Breadcrumb.module.css'

export function Breadcrumb({ items }) {
  return (
    <nav className={styles.crumbs} aria-label="Навигация">
      {items.map((item, index) => (
        <span key={item.label}>
          {index > 0 ? <span className={styles.sep}>/</span> : null}
          {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}
