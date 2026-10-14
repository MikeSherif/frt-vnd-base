import { useFavoriteToggle } from '../model/useFavoriteToggle.js'
import styles from './FavoriteButton.module.css'

export function FavoriteButton({ documentId, plain = false }) {
  const { active, toggle } = useFavoriteToggle(documentId)
  const boxed = active ? styles.on : styles.off
  const quiet = active ? styles.plainOn : styles.plain
  return (
    <button
      type="button"
      className={plain ? quiet : boxed}
      onClick={toggle}
      aria-pressed={active}
      aria-label={active ? 'Убрать из избранного' : 'Добавить в избранное'}
    >
      {active ? '★' : '☆'}
    </button>
  )
}
