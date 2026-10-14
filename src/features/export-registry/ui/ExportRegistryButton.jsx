import { useState } from 'react'
import { todayIso } from '../../../shared/date-text'
import { Button } from '../../../shared/button'
import { downloadRegistry } from '../model/downloadRegistry.js'
import styles from './ExportRegistryButton.module.css'

export function ExportRegistryButton({ documents, filters, appearance = 'button' }) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  async function onClick() {
    setPending(true)
    setError('')
    try {
      await downloadRegistry(documents, filters, todayIso())
    } catch {
      setError('Не удалось сформировать файл')
    } finally {
      setPending(false)
    }
  }

  const label = pending ? 'Формируем…' : 'Выгрузить реестр'
  return (
    <span className={styles.wrap}>
      {appearance === 'link' ? (
        <button type="button" className={styles.link} onClick={onClick} disabled={pending}>{label}</button>
      ) : (
        <Button variant="secondary" onClick={onClick} disabled={pending}>{label}</Button>
      )}
      {error ? <span className={styles.error}>{error}</span> : null}
    </span>
  )
}
