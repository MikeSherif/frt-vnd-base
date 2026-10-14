import { Button } from '../../../shared/button'
import { publishLabel } from '../model/publishLabel.js'
import styles from './PublishDocument.module.css'

export function PublishDocument({
  published,
  errors,
  warnings,
  notice,
  dateChangeNeeded,
  dateChangeConfirmed,
  onDateChangeConfirmed,
  onSaveDraft,
  onPublish,
}) {
  return (
    <section className={styles.panel}>
      <h2>Публикация</h2>
      {errors.length ? (
        <ul className={styles.errors}>
          {errors.map((error) => <li key={error}>{error}</li>)}
        </ul>
      ) : null}
      {warnings.length ? (
        <ul className={styles.warnings}>
          {warnings.map((warning) => <li key={warning}>{warning}</li>)}
        </ul>
      ) : null}
      {notice ? <p>{notice}</p> : null}
      {dateChangeNeeded ? (
        <label className={styles.confirm}>
          <input
            type="checkbox"
            checked={dateChangeConfirmed}
            onChange={(event) => onDateChangeConfirmed(event.target.checked)}
          />
          <span>Подтверждаю исправление опубликованной даты. История периодов будет пересчитана, изменение попадёт в журнал.</span>
        </label>
      ) : null}
      <div className={styles.actions}>
        {published ? null : <Button variant="secondary" onClick={onSaveDraft}>Сохранить черновик</Button>}
        <Button onClick={onPublish}>{publishLabel(published)}</Button>
      </div>
    </section>
  )
}
