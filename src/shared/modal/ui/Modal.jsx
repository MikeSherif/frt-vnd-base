import { useEffect } from 'react'
import { isModalOpen } from '../model/isModalOpen.js'
import styles from './Modal.module.css'

export function Modal({ title, open, onClose, children }) {
  useEffect(() => {
    if (!isModalOpen(open)) return undefined
    function onKey(event) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!isModalOpen(open)) return null

  return (
    <div className={styles.backdrop} onClick={onClose} role="presentation">
      <div className={styles.dialog} role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
        <div className={styles.head}>
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Закрыть">×</button>
        </div>
        {children}
      </div>
    </div>
  )
}
