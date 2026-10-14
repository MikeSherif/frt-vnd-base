import { DUTIES_TEXT } from '../model/dutiesText.js'
import { PageFrame } from '../../../shared/page-frame'
import styles from './DutiesPage.module.css'

export function DutiesPage() {
  return (
    <PageFrame crumbs={[{ label: 'Главная страница', to: '/' }, { label: 'База знаний', to: '/' }, { label: 'Распределение обязанностей' }]}>
      <h2 className={styles.title}>Распределение обязанностей</h2>
      <p className={styles.text}>{DUTIES_TEXT}</p>
    </PageFrame>
  )
}
