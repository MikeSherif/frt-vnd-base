import { Link, useParams } from 'react-router-dom'
import { useVndState } from '../../../entities/document'
import { PageFrame } from '../../../shared/page-frame'
import { useFunctionCard } from '../model/useFunctionCard.js'
import styles from './FunctionCardPage.module.css'

export function FunctionCardPage() {
  const { id } = useParams()
  const state = useVndState()
  const { item, links } = useFunctionCard(id, state.documents)
  if (!item) {
    return (
      <PageFrame crumbs={[{ label: 'Главная страница', to: '/' }, { label: 'База знаний', to: '/' }, { label: 'Каталог функций', to: '/functions' }]}>
        <p>Функция не найдена.</p>
      </PageFrame>
    )
  }
  return (
    <PageFrame crumbs={[{ label: 'Главная страница', to: '/' }, { label: 'База знаний', to: '/' }, { label: 'Каталог функций', to: '/functions' }, { label: item.name }]}>
      <h2 className={styles.title}>{item.name}</h2>
      <p>Уровень {item.level}</p>
      {links.length === 0 ? <p>Связанных ВНД нет.</p> : (
        <table className={styles.table}>
          <thead>
            <tr><th>ВНД</th><th>Роль</th><th></th></tr>
          </thead>
          <tbody>
            {links.map(({ document, role }) => (
              <tr key={document.id}>
                <td>{document.number} {document.shortTitle}</td>
                <td>{role}</td>
                <td><Link to={`/documents/${document.id}`}>Открыть</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PageFrame>
  )
}
