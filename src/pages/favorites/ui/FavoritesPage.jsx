import { useVndState } from '../../../entities/document'
import { useSession } from '../../../entities/session'
import { todayIso } from '../../../shared/date-text'
import { EmptyState } from '../../../shared/empty-state'
import { PageFrame } from '../../../shared/page-frame'
import { DocumentTable } from '../../../widgets/document-table'
import { favoriteDocuments } from '../model/favoriteDocuments.js'
import styles from './FavoritesPage.module.css'

export function FavoritesPage() {
  const state = useVndState()
  const user = useSession()
  const rows = favoriteDocuments(state.documents, user.id)
  return (
    <PageFrame crumbs={[{ label: 'Главная страница', to: '/' }, { label: 'База знаний', to: '/' }, { label: 'Избранное' }]}>
      <h2 className={styles.title}>Избранное</h2>
      {rows.length === 0 ? <EmptyState title="В избранном пока нет документов" /> : (
        <DocumentTable rows={rows} today={todayIso()} sort="" sortDir="desc" onSort={() => {}} />
      )}
    </PageFrame>
  )
}
