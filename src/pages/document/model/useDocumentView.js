import { useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import {
  departmentName,
  displayRevision,
  DOCUMENT_KINDS,
  findDuplicateFiles,
  functionById,
  functionName,
  FUNCTION_ROLES,
  labelOf,
  RELEVANCE,
  resolveRevision,
  revisionById,
  STATUSES,
  useVndState,
  VND_LINK_ROLES,
} from '../../../entities/document'
import { useSession } from '../../../entities/session'
import { todayIso } from '../../../shared/date-text'

export function useDocumentView() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const state = useVndState()
  const user = useSession()
  const today = todayIso()
  const source = state.documents.find((item) => item.id === id) ?? null
  const onDate = params.get('onDate') ?? ''
  const revisionParam = params.get('revision') ?? ''
  const resolution = source && onDate ? resolveRevision(source.revisions, onDate) : null
  const current = source ? resolveRevision(source.revisions, today).revision : null
  const explicit = source && revisionParam ? revisionById(source, revisionParam) : null

  let shown = null
  if (source) {
    if (onDate) shown = resolution?.revision ?? null
    else if (explicit) shown = explicit
    else shown = displayRevision(source, today)
  }

  const document = useMemo(() => {
    if (!source) return null
    return {
      ...source,
      kindLabel: labelOf(DOCUMENT_KINDS, source.kind),
      statusLabel: labelOf(STATUSES, source.status),
      relevanceLabel: labelOf(RELEVANCE, source.relevance),
      owner: departmentName(source.ownerDeptId),
      processOwner: departmentName(source.processOwnerDeptId),
    }
  }, [source])

  const functionRows = (source?.functionLinks ?? []).map((link) => ({
    id: `${link.functionId}-${link.role}`,
    name: functionName(link.functionId),
    role: labelOf(FUNCTION_ROLES, link.role),
    to: functionById(link.functionId) ? `/functions/${link.functionId}` : null,
  }))

  const documentRows = (source?.documentLinks ?? []).map((link) => {
    const target = state.documents.find((item) => item.id === link.targetId && item.published)
    const revision = target?.revisions.find((item) => item.number === Number(link.targetRevision))
    return {
      id: link.id,
      name: target ? `${target.number} ${target.shortTitle}` : 'Недостаточно прав или документ недоступен',
      role: labelOf(VND_LINK_ROLES, link.role),
      to: target ? `/documents/${target.id}${revision ? `?revision=${revision.id}` : ''}` : null,
    }
  })

  function goHome() {
    const stored = sessionStorage.getItem('vnd-catalog-search') || '/vnd'
    if (stored === '/') navigate('/vnd')
    else if (stored.startsWith('/?')) navigate(`/vnd${stored.slice(1)}`)
    else navigate(stored)
  }

  function selectRevision(revisionId) {
    const next = new URLSearchParams(params)
    next.set('revision', revisionId)
    next.delete('onDate')
    setParams(next)
  }

  function selectDate(date) {
    const next = new URLSearchParams()
    if (date) next.set('onDate', date)
    setParams(next)
  }

  return {
    document,
    shown,
    currentId: current?.id ?? null,
    onDate,
    resolution,
    goHome,
    selectRevision,
    selectDate,
    functionRows,
    documentRows,
    duplicates: source ? findDuplicateFiles(source, state.documents) : [],
    canEdit: user.role === 'docflow',
    hidden: Boolean(source && !source.published && user.role !== 'docflow'),
    missing: !source,
  }
}
