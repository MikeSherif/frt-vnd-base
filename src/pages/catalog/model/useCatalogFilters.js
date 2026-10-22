import { useSearchParams } from 'react-router-dom'
import { useCatalogFilterStore } from './catalogFilterStore.js'

export function useCatalogFilters() {
  const [params, setParams] = useSearchParams()
  const search = params.toString()
  const storedSearch = useCatalogFilterStore((state) => state.search)
  const storedFilters = useCatalogFilterStore((state) => state.filters)

  if (storedSearch !== search) {
    useCatalogFilterStore.getState().syncFromUrl(search)
  }

  const filters = storedSearch === search ? storedFilters : useCatalogFilterStore.getState().filters

  function setFilters(patch) {
    useCatalogFilterStore.getState().setFilters(patch, setParams)
  }

  function reset() {
    useCatalogFilterStore.getState().reset(setParams)
  }

  function selectPreset(preset) {
    useCatalogFilterStore.getState().selectPreset(preset, setParams)
  }

  return { filters, setFilters, reset, selectPreset }
}
