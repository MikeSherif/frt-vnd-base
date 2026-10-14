import { PRESETS } from '../../../entities/document'

const VALUES = { all: 'total', active: 'active', archived: 'archived', review: 'review', updated30: 'updated' }

export function metricCards(metrics) {
  return PRESETS.map((preset) => ({
    id: preset.id,
    label: preset.label,
    hint: preset.hint,
    value: metrics[VALUES[preset.id]],
    subtitle: preset.id === 'updated30' ? '(новая редакция)' : '',
  }))
}
