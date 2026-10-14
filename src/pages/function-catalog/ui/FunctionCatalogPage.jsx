import { CATALOG_TEXT } from '../model/catalogText.js'
import { PageFrame } from '../../../shared/page-frame'
import styles from './FunctionCatalogPage.module.css'

export function FunctionCatalogPage() {
  return (
    <PageFrame crumbs={[{ label: 'Главная страница', to: '/' }, { label: 'База знаний', to: '/' }, { label: 'Каталог функций' }]}>
      <h2 className={styles.title}>Каталог функций</h2>
      <p className={styles.text}>{CATALOG_TEXT}</p>
    </PageFrame>
  )
}
