import { useSubscription } from '../model/useSubscription.js'
import { Button } from '../../../shared/button'
import styles from './SubscribeButton.module.css'

export function SubscribeButton({ target, label, appearance = 'button' }) {
  const { active, toggle } = useSubscription(target)
  const text = label ?? (target === 'section' ? 'Подписаться на раздел' : 'Подписаться на документ')
  if (appearance === 'link') {
    return (
      <button type="button" className={styles.link} onClick={toggle} aria-pressed={active}>
        {active ? 'Вы подписаны' : text}
      </button>
    )
  }
  return (
    <Button variant={active ? 'primary' : 'secondary'} onClick={toggle} aria-pressed={active}>
      {active ? 'Вы подписаны' : text}
    </Button>
  )
}
