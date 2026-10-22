import { create } from 'zustand'
import { EMPTY_FILTERS, parseFilters, serializeFilters } from '../../../entities/document'

function rememberCatalog(search) {
  try {
    sessionStorage.setItem('vnd-catalog-search', search ? `/vnd?${search}` : '/vnd')
  } catch {
    // Возврат с карточки останется на реестре без сохранённого фильтра.
  }
}

export const useCatalogFilterStore = create((set, get) => ({
  search: null,
  filters: EMPTY_FILTERS,
  syncFromUrl(search) {
    if (get().search === search) return
    set({
      search,
      filters: parseFilters(new URLSearchParams(search)),
    })
    rememberCatalog(search)
  },
  commit(next, setParams) {
    const params = serializeFilters(next)
    const search = params.toString()
    set({ filters: next, search })
    setParams(params)
    rememberCatalog(search)
  },
  setFilters(patch, setParams) {
    const next = { ...get().filters, ...patch }
    if (!Object.prototype.hasOwnProperty.call(patch, 'page')) next.page = 1
    get().commit(next, setParams)
  },
  reset(setParams) {
    get().commit({ ...EMPTY_FILTERS }, setParams)
  },
  selectPreset(preset, setParams) {
    get().setFilters({
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
    }, setParams)
  },
}))
