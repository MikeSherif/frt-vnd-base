import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { computeMetrics } from '../model/metrics.js'
import {
  getDocument,
  readBundle,
  resetDemo,
  saveDocument,
  toggleFavorite,
  toggleSubscription,
} from './repository.js'

export const documentKeys = {
  all: ['documents'],
  detail: (id) => ['documents', id],
}

function bundleOptions() {
  return {
    queryKey: documentKeys.all,
    queryFn: () => readBundle(),
    initialData: () => readBundle(),
    staleTime: Infinity,
    structuralSharing: false,
  }
}

function writeCache(client) {
  const bundle = readBundle()
  client.setQueryData(documentKeys.all, bundle)
  bundle.documents.forEach((document) => {
    client.setQueryData(documentKeys.detail(document.id), document)
  })
  return bundle
}

export function useDocuments() {
  return useQuery(bundleOptions())
}

export function useDocumentList() {
  return useQuery({
    ...bundleOptions(),
    select: (bundle) => bundle.documents,
  })
}

export function useDocument(id) {
  return useQuery({
    queryKey: documentKeys.detail(id ?? ''),
    queryFn: () => (id ? getDocument(id) : null),
    enabled: Boolean(id),
    initialData: () => (id ? getDocument(id) : null),
    staleTime: Infinity,
    structuralSharing: false,
  })
}

export function useMetrics() {
  return useQuery({
    ...bundleOptions(),
    select: (bundle) => computeMetrics(bundle.documents),
  })
}

export function useIsFavorite(userId, documentId) {
  return useQuery({
    ...bundleOptions(),
    select: (bundle) => (bundle.favorites[userId] ?? []).includes(documentId),
  })
}

export function useIsSubscribed(userId, target) {
  return useQuery({
    ...bundleOptions(),
    select: (bundle) => {
      const current = bundle.subscriptions[userId] ?? { section: false, documents: [] }
      if (target === 'section') return current.section
      return current.documents.includes(target)
    },
  })
}

export function useSaveDocument() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ draft, publish, dateChangeConfirmed, actor }) => saveDocument(draft, {
      publish,
      dateChangeConfirmed,
      actor,
    }),
    onSuccess: (result) => {
      if (result.ok) writeCache(client)
    },
  })
}

export function useToggleFavorite() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, documentId }) => toggleFavorite(userId, documentId),
    onSuccess: () => writeCache(client),
  })
}

export function useToggleSubscription() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ userId, target }) => toggleSubscription(userId, target),
    onSuccess: () => writeCache(client),
  })
}

export function useResetDocuments() {
  const client = useQueryClient()
  return () => {
    const previousIds = new Set(readBundle().documents.map((document) => document.id))
    const next = resetDemo()
    client.setQueryData(documentKeys.all, next)
    next.documents.forEach((document) => {
      previousIds.delete(document.id)
      client.setQueryData(documentKeys.detail(document.id), document)
    })
    previousIds.forEach((id) => {
      client.removeQueries({ queryKey: documentKeys.detail(id), exact: true })
    })
  }
}
