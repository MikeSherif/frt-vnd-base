import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createEmptyDocument,
  getDocument,
  publishedDatesChanged,
  saveDocument,
  useVndState,
} from '../../../entities/document'
import { useSession } from '../../../entities/session'

function clone(document) {
  return JSON.parse(JSON.stringify(document))
}

export function useAdminForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSession()
  const state = useVndState()
  const existing = id ? state.documents.find((document) => document.id === id) ?? null : null
  const [draft, setDraft] = useState(() => (id ? clone(getDocument(id) ?? createEmptyDocument()) : createEmptyDocument()))
  const [errors, setErrors] = useState([])
  const [warnings, setWarnings] = useState([])
  const [notice, setNotice] = useState('')
  const [dateChangeConfirmed, setDateChangeConfirmed] = useState(false)

  useEffect(() => {
    if (id && !getDocument(id)) return
    setDraft(id ? clone(getDocument(id)) : createEmptyDocument())
    setErrors([])
    setWarnings([])
    setNotice('')
    setDateChangeConfirmed(false)
  }, [id])

  function apply(result) {
    if (!result.ok) {
      setErrors(result.errors)
      setWarnings([])
      setNotice('')
      return
    }
    setDraft(clone(result.document))
    setErrors([])
    setWarnings(result.warnings)
    setNotice(result.notice || 'Карточка сохранена.')
    if (result.document.published) {
      navigate(`/documents/${result.document.id}`)
      return
    }
    if (!id) navigate(`/admin/documents/${result.document.id}`, { replace: true })
  }

  function save(publish) {
    apply(saveDocument(draft, {
      publish,
      dateChangeConfirmed,
      actor: user.name,
    }))
  }

  return {
    allowed: user.role === 'docflow',
    missing: Boolean(id) && !existing,
    draft,
    setDraft,
    documents: state.documents,
    errors,
    warnings,
    notice,
    dateChangeNeeded: publishedDatesChanged(existing, draft),
    dateChangeConfirmed,
    setDateChangeConfirmed,
    saveDraft() { save(false) },
    publish() { save(true) },
    published: Boolean(existing?.published),
  }
}
