import { Link } from 'react-router-dom'
import { useVndState } from '../../../entities/document'
import { PageFrame } from '../../../shared/page-frame'
import { functionsWithCounts } from '../model/functionsWithCounts.js'
import styles from './FunctionCatalogPage.module.css'

export function FunctionCatalogPage() {
  const state = useVndState()
  const functions = functionsWithCounts(state.documents)
  return (
    <PageFrame crumbs={[{ label: 'Главная страница', to: '/' }, { label: 'База знаний', to: '/' }, { label: 'Каталог функций' }]}>
      <h2 className={styles.title}>Каталог функций</h2>
      <ul className={styles.list}>
        {functions.map((item) => (
          <li key={item.id}>
            <Link to={`/functions/${item.id}`}>
              <span>{item.name} <span className={styles.level}>уровень {item.level}</span></span>
              <span>ВНД: {item.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </PageFrame>
  )
}
