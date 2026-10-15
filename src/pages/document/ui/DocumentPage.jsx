import { ChangeLog } from '../../../widgets/change-log'
import { DocumentHeader } from '../../../widgets/document-header'
import { PdfViewer } from '../../../widgets/pdf-viewer'
import { RelatedLinks } from '../../../widgets/related-links'
import { RelevanceTimeline } from '../../../widgets/relevance-timeline'
import { RevisionList } from '../../../widgets/revision-list'
import { PageFrame, vndCrumbs } from '../../../shared/page-frame'
import { useDocumentView } from '../model/useDocumentView.js'
import styles from './DocumentPage.module.css'

export function DocumentPage() {
  const view = useDocumentView()
  if (view.missing || view.hidden) {
    return (
      <PageFrame crumbs={vndCrumbs()}>
        <p>Документ недоступен.</p>
      </PageFrame>
    )
  }

  const file = view.shown?.file ?? null
  return (
    <PageFrame crumbs={vndCrumbs()}>
      <DocumentHeader
        document={view.document}
        revision={view.shown}
        file={file}
        onBack={view.goHome}
        editTo={view.canEdit ? `/admin/documents/${view.document.id}` : null}
      />
      {view.duplicates.length ? (
        <ul className={styles.warning}>
          {view.duplicates.map((warning) => <li key={warning}>{warning}</li>)}
        </ul>
      ) : null}
      <div className={styles.layout}>
        <div>
          <PdfViewer file={file} />
          {view.shown?.attachments?.length ? (
            <ul className={styles.files}>
              {view.shown.attachments.map((attachment) => (
                <li key={attachment.id}>
                  {attachment.url ? <a href={attachment.url} download={attachment.name}>{attachment.name}</a> : attachment.name}
                  {' '}— без предпросмотра
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <aside className={styles.side}>
          <RevisionList
            revisions={view.document.revisions}
            currentId={view.currentId}
            selectedId={view.shown?.id}
            documentStatus={view.document.status}
            onSelect={view.selectRevision}
          />
          <RelevanceTimeline events={view.document.relevanceEvents} />
          <RelatedLinks functions={view.functionRows} documents={view.documentRows} />
          <ChangeLog entries={view.document.changelog} />
        </aside>
      </div>
    </PageFrame>
  )
}
