import { Link } from 'react-router-dom'
import { useMetrics } from '../../../entities/document'
import { PageFrame } from '../../../shared/page-frame'
import { sectionTiles } from '../model/sectionTiles.js'
import { SectionIcon } from './SectionIcon.jsx'
import styles from './SectionsPage.module.css'

export function SectionsPage() {
  const { data: metrics } = useMetrics()
  const tiles = sectionTiles(metrics?.total ?? 0)
  return (
    <PageFrame>
      <div className={styles.grid}>
        {tiles.map((tile) => {
          const body = (
            <>
              <SectionIcon name={tile.icon} />
              <span>{tile.title}</span>
            </>
          )
          return (
            <div key={tile.id} className={styles.item}>
              {tile.to ? (
                <Link className={styles.tile} to={tile.to}>{body}</Link>
              ) : (
                <div className={styles.tile} title="Этот раздел откроется на портале">{body}</div>
              )}
              <p className={styles.count}>Документов: {tile.count}</p>
            </div>
          )
        })}
      </div>
    </PageFrame>
  )
}
