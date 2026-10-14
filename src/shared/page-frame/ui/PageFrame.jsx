import { Breadcrumb } from './Breadcrumb.jsx'
import styles from './PageFrame.module.css'

export function PageFrame({ crumbs, children }) {
  return (
    <div className={styles.page}>
      {crumbs?.length ? <Breadcrumb items={crumbs} /> : null}
      <h1>База знаний</h1>
      <section className={styles.sheet}>{children}</section>
    </div>
  )
}
