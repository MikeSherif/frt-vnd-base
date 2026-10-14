import { Link } from 'react-router-dom'
import styles from './RelatedLinks.module.css'

function Table({ rows, nameLabel }) {
  if (!rows.length) return <p className={styles.empty}>Связей нет.</p>
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>{nameLabel}</th>
          <th>Роль</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.name}</td>
            <td>
              <span>{row.role}</span>
              {row.to ? <Link to={row.to} aria-label={`Открыть ${row.name}`}>→</Link> : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export function RelatedLinks({ functions, documents }) {
  return (
    <section className={styles.card}>
      <h2>Связанные документы и процессы</h2>
      <Table rows={functions} nameLabel="Функция" />
      <Table rows={documents} nameLabel="Документ" />
    </section>
  )
}
