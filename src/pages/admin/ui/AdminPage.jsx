import { DocumentForm } from '../../../widgets/document-form'
import { PublishDocument } from '../../../features/publish-document'
import { PageFrame, vndCrumbs } from '../../../shared/page-frame'
import { useAdminForm } from '../model/useAdminForm.js'
import styles from './AdminPage.module.css'

export function AdminPage() {
  const form = useAdminForm()
  if (!form.allowed) {
    return (
      <PageFrame crumbs={vndCrumbs()}>
        <p>Добавление и изменение ВНД доступно сотрудникам документооборота.</p>
      </PageFrame>
    )
  }
  if (form.missing) {
    return (
      <PageFrame crumbs={vndCrumbs()}>
        <p>Документ не найден.</p>
      </PageFrame>
    )
  }

  return (
    <PageFrame crumbs={[...vndCrumbs(), { label: form.published ? 'Карточка ВНД' : 'Новый ВНД' }]}>
      <div className={styles.page}>
        <h2>{form.published ? 'Карточка ВНД' : 'Новый ВНД'}</h2>
      <DocumentForm value={form.draft} documents={form.documents} onChange={form.setDraft} />
      <PublishDocument
        published={form.published}
        errors={form.errors}
        warnings={form.warnings}
        notice={form.notice}
        dateChangeNeeded={form.dateChangeNeeded}
        dateChangeConfirmed={form.dateChangeConfirmed}
        onDateChangeConfirmed={form.setDateChangeConfirmed}
        onSaveDraft={form.saveDraft}
        onPublish={form.publish}
      />
      </div>
    </PageFrame>
  )
}
