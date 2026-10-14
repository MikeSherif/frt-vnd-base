import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { EMPTY_FILTERS, parseFilters, serializeFilters } from '../../../entities/document'

export function useCatalogFilters() {
  const [params, setParams] = useSearchParams()
  const search = params.toString()
  const filters = useMemo(() => parseFilters(new URLSearchParams(search)), [search])

  useEffect(() => {
    const search = params.toString()
    sessionStorage.setItem('vnd-catalog-search', search ? `/vnd?${search}` : '/vnd')
  }, [params])

  function setFilters(patch) {
    const next = { ...filters, ...patch }
    if (!Object.prototype.hasOwnProperty.call(patch, 'page')) next.page = 1
    setParams(serializeFilters(next))
  }

  function reset() {
    setParams(serializeFilters(EMPTY_FILTERS))
  }

  function selectPreset(preset) {
    setFilters({
      q: '',
      preset,
      status: [],
      kind: [],
      owner: [],
      processOwner: [],
      relevance: [],
      functionIds: [],
      adoptedFrom: '',
      adoptedTo: '',
      publishedFrom: '',
      publishedTo: '',
      onDate: '',
    })
  }

  return { filters, setFilters, reset, selectPreset }
}
