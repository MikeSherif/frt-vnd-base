import { Link } from 'react-router-dom'
import {
  filterDocuments,
  sortDocuments,
  useDocumentList,
  useMetrics,
} from '../../../entities/document'
import { useSession } from '../../../entities/session'
import { todayIso } from '../../../shared/date-text'
import { buttonClass } from '../../../shared/button'
import { EmptyState } from '../../../shared/empty-state'
import { Pagination } from '../../../shared/pagination'
import { Button } from '../../../shared/button'
import { PageFrame, vndCrumbs } from '../../../shared/page-frame'
import { Select } from '../../../shared/select'
import { ExportRegistryButton } from '../../../features/export-registry'
import { DocumentTable } from '../../../widgets/document-table'
import { MetricsBar } from '../../../widgets/metrics-bar'
import { PortalLinks } from '../../../widgets/portal-links'
import { SearchFilters } from '../../../widgets/search-filters'
import { filtersAreNarrowed } from '../model/filtersAreNarrowed.js'
import { useCatalogFilters } from '../model/useCatalogFilters.js'
import styles from './CatalogPage.module.css'

export function CatalogPage() {
  const { filters, setFilters, reset, selectPreset } = useCatalogFilters()
  const { data: documents = [] } = useDocumentList()
  const { data: metrics } = useMetrics()
  const user = useSession()
  const today = todayIso()
  const filtered = sortDocuments(filterDocuments(documents, filters, today), filters, today)
  const start = (filters.page - 1) * filters.pageSize
  const rows = filtered.slice(start, start + filters.pageSize)
  const narrowed = filtersAreNarrowed(filters)

  function onSort(column) {
    if (filters.sort === column) {
      setFilters({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc', page: 1 })
      return
    }
    setFilters({ sort: column, sortDir: 'asc', page: 1 })
  }

  return (
    <PageFrame crumbs={vndCrumbs(true)}>
      {metrics ? <MetricsBar metrics={metrics} preset={filters.preset} onSelect={selectPreset} /> : null}
      <SearchFilters
        filters={filters}
        onChange={setFilters}
        leading={user.role === 'docflow' ? <Link className={buttonClass()} to="/admin/documents/new">+ Добавить ВНД</Link> : null}
        trailing={(
          <>
            <ExportRegistryButton documents={filtered} filters={filters} appearance="link" />
            {narrowed ? (
              <button type="button" className={styles.star} onClick={reset}>★ Сбросить</button>
            ) : (
              <Link className={styles.star} to="/favorites">★ Избранное</Link>
            )}
          </>
        )}
      />
      {rows.length === 0 ? (
        <EmptyState title="Документы не найдены" action={<Button onClick={reset}>Сбросить условия</Button>} />
      ) : (
        <DocumentTable rows={rows} today={today} sort={filters.sort} sortDir={filters.sortDir} onSort={onSort} />
      )}
      <Pagination
        page={filters.page}
        pageSize={filters.pageSize}
        total={filtered.length}
        onPageChange={(page) => setFilters({ page })}
        pageSizeControl={(
          <Select
            compact
            menuPlacement="top"
            ariaLabel="На странице"
            value={String(filters.pageSize)}
            options={[20, 50, 100].map((size) => ({ id: String(size), label: String(size) }))}
            onChange={(id) => setFilters({ pageSize: Number(id) })}
          />
        )}
      />
      <PortalLinks />
    </PageFrame>
  )
}
