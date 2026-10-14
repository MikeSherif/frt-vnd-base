import { metricCards } from '../model/metricCards.js'
import { MetricIcon } from './MetricIcon.jsx'
import styles from './MetricsBar.module.css'

export function MetricsBar({ metrics, preset, onSelect }) {
  const note = `Рассчитано по всей базе. Будущие: ${metrics.future}. Период не установлен: ${metrics.unknownPeriod}. Без владельца: ${metrics.noOwner}.`
  return (
    <section className={styles.section} title={note}>
      <div className={styles.grid}>
        {metricCards(metrics).map((card) => (
          <button
            key={card.id}
            type="button"
            className={preset === card.id ? styles.active : styles.card}
            onClick={() => onSelect(card.id)}
            aria-pressed={preset === card.id}
          >
            <span className={styles.icon}><MetricIcon id={card.id} /></span>
            <span className={styles.text}>
              <span className={styles.label}>{card.label}</span>
              <span className={styles.value}>{card.value}</span>
              {card.subtitle ? <span className={styles.sub}>{card.subtitle}</span> : null}
            </span>
          </button>
        ))}
      </div>
      <p className={styles.note}>{note}</p>
    </section>
  )
}
