import { Link } from 'react-router-dom'
import { departmentName, displayRevision, labelOf, RELEVANCE, STATUSES } from '../../../entities/document'
import { DateText } from '../../../shared/date-text'
import { FavoriteButton } from '../../../features/toggle-favorite'
import { COLUMNS } from '../model/columns.js'
import styles from './DocumentTable.module.css'

function PdfMark() {
  return (
    <svg className={styles.pdf} width="28" height="32" viewBox="0 0 28 32" aria-hidden="true">
      <path d="M6 2h11l7 7v19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#fff" stroke="#d24b4b" strokeWidth="1.4" />
      <path d="M17 2v7h7" fill="none" stroke="#d24b4b" strokeWidth="1.4" />
      <text x="6" y="22" fill="#d24b4b" fontSize="7" fontFamily="Arial, sans-serif" fontWeight="700">PDF</text>
    </svg>
  )
}

export function DocumentTable({ rows, today, sort, sortDir, onSort }) {
  return (
    <div className={styles.scroll}>
      <table className={styles.table}>
        <thead>
          <tr>
            {COLUMNS.map((column) => (
              <th key={column.id} aria-sort={sort === column.id ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}>
                <button type="button" onClick={() => onSort(column.id)}>{column.label}</button>
              </th>
            ))}
            <th aria-label="Скачать" />
            <th aria-label="Избранное" />
          </tr>
        </thead>
        <tbody>
          {rows.map((document) => {
            const revision = displayRevision(document, today)
            const file = revision?.file
            return (
              <tr key={document.id}>
                <td>
                  <div className={styles.doc}>
                    <PdfMark />
                    <Link className={styles.title} to={`/documents/${document.id}`}>
                      {document.fullTitle || document.shortTitle}
                    </Link>
                  </div>
                </td>
                <td>{departmentName(document.ownerDeptId)}</td>
                <td className={styles.date}><DateText value={document.adoptedAt} /></td>
                <td>{labelOf(STATUSES, document.status)}</td>
                <td>{labelOf(RELEVANCE, document.relevance)}</td>
                <td className={styles.icon}>
                  {file?.url ? (
                    <a href={file.url} download={file.name} aria-label={`Скачать ${document.shortTitle || 'документ'}`}>↓</a>
                  ) : <span className={styles.muted}>—</span>}
                </td>
                <td className={styles.icon}>
                  <FavoriteButton documentId={document.id} plain />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
