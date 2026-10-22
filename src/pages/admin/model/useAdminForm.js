import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createEmptyDocument,
  createPublicationResolver,
  publishedDatesChanged,
  useDocument,
  useDocuments,
  useSaveDocument,
} from '../../../entities/document'
import { useSession } from '../../../entities/session'
import { collectMessages } from './collectMessages.js'

function clone(document) {
  return JSON.parse(JSON.stringify(document))
}

function withoutFieldKeys(value) {
  if (Array.isArray(value)) return value.map(withoutFieldKeys)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => key !== 'fieldKey')
      .map(([key, item]) => [key, withoutFieldKeys(item)]),
  )
}

export function useAdminForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSession()
  const documentQuery = useDocument(id)
  const documentsQuery = useDocuments()
  const saveDocument = useSaveDocument()
  const existing = id ? documentQuery.data : null
  const intent = useRef('draft')
  const publicationRef = useRef({ dateChangeConfirmed: false, previous: null })
  const [dateChangeConfirmed, setDateChangeConfirmed] = useState(false)
  const [serverErrors, setServerErrors] = useState([])
  const [warnings, setWarnings] = useState([])
  const [notice, setNotice] = useState('')
  publicationRef.current = { dateChangeConfirmed, previous: existing }

  const resolver = useMemo(() => createPublicationResolver({
    intent,
    getPublicationContext: () => publicationRef.current,
  }), [])

  const methods = useForm({
    defaultValues: id && existing ? clone(existing) : createEmptyDocument(),
    resolver,
  })
  const draft = useWatch({ control: methods.control })

  const loadedFor = useRef(null)
  useEffect(() => {
    if (id && !existing) return
    const token = id ?? 'new'
    if (loadedFor.current === token) return
    loadedFor.current = token
    methods.reset(id ? clone(existing) : createEmptyDocument())
    setServerErrors([])
    setWarnings([])
    setNotice('')
    setDateChangeConfirmed(false)
  }, [existing, id, methods])

  async function save(publish) {
    intent.current = publish ? 'publish' : 'draft'
    const valid = await methods.trigger()
    if (!valid) {
      setServerErrors([])
      setWarnings([])
      setNotice('')
      return
    }
    const result = await saveDocument.mutateAsync({
      draft: withoutFieldKeys(methods.getValues()),
      publish,
      dateChangeConfirmed,
      actor: user.name,
    })
    if (!result.ok) {
      setServerErrors(result.errors)
      setWarnings([])
      setNotice('')
      return
    }
    methods.reset(clone(result.document))
    setServerErrors([])
    setWarnings(result.warnings)
    setNotice(result.notice || 'Карточка сохранена.')
    if (result.document.published) {
      navigate(`/documents/${result.document.id}`)
      return
    }
    if (!id) navigate(`/admin/documents/${result.document.id}`, { replace: true })
  }

  const fieldErrors = collectMessages(methods.formState.errors)

  return {
    methods,
    allowed: user.role === 'docflow',
    missing: Boolean(id) && !existing,
    documents: documentsQuery.data?.documents ?? [],
    errors: [...new Set([...fieldErrors, ...serverErrors])],
    warnings,
    notice,
    dateChangeNeeded: publishedDatesChanged(existing, draft),
    dateChangeConfirmed,
    setDateChangeConfirmed,
    saveDraft() { save(false) },
    publish() { save(true) },
    published: Boolean(existing?.published),
    dateError: methods.formState.errors.root?.dateChangeConfirmed?.message ?? '',
  }
}
