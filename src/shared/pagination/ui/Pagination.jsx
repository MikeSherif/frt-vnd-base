import styles from './Pagination.module.css'
import { pageCount } from '../model/pageCount.js'
import { pageWindow } from '../model/pageWindow.js'

export function Pagination({ page, pageSize, total, onPageChange, pageSizeControl }) {
  const pages = pageCount(total, pageSize)
  const current = Math.min(page, pages)
  const items = pageWindow(current, pages)

  return (
    <div className={styles.bar}>
      <div className={styles.cluster}>
        <span>Всего: {total}</span>
        <span className={styles.pagesLabel}>Страницы:</span>
        {items.map((item) => (
          typeof item === 'number' ? (
            <button
              key={item}
              type="button"
              className={item === current ? styles.current : styles.page}
              onClick={() => onPageChange(item)}
              aria-current={item === current ? 'page' : undefined}
            >
              {item}
            </button>
          ) : <span key={item} className={styles.gap}>…</span>
        ))}
      </div>
      <div className={styles.cluster}>
        <button type="button" className={styles.move} onClick={() => onPageChange(current - 1)} disabled={current <= 1}>‹ Предыдущая</button>
        <button type="button" className={styles.move} onClick={() => onPageChange(current + 1)} disabled={current >= pages}>Следующая ›</button>
      </div>
      <label className={styles.size}>
        На странице:
        {pageSizeControl}
      </label>
    </div>
  )
}
