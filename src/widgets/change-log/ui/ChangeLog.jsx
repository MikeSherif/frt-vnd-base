import { useState } from 'react'
import { Modal } from '../../../shared/modal'
import { changeMoment, sortedChanges } from '../model/sortedChanges.js'
import styles from './ChangeLog.module.css'

export function ChangeLog({ entries }) {
  const [open, setOpen] = useState(false)
  const rows = sortedChanges(entries)
  return (
    <section className={styles.card}>
      <button type="button" className={styles.open} onClick={() => setOpen(true)}>Журнал изменений</button>
      <Modal title="Журнал изменений" open={open} onClose={() => setOpen(false)}>
        {rows.length === 0 ? <p>Изменений пока нет.</p> : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Когда</th>
                <th>Кто</th>
                <th>Поле</th>
                <th>Было</th>
                <th>Стало</th>
                <th>Причина</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((entry) => (
                <tr key={entry.id}>
                  <td>{changeMoment(entry.at)}</td>
                  <td>{entry.who}</td>
                  <td>{entry.field}</td>
                  <td>{entry.oldValue}</td>
                  <td>{entry.newValue}</td>
                  <td>{entry.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    </section>
  )
}
