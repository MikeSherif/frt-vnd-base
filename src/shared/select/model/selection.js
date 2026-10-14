export function selectionLabel(options, value, multiple, placeholder) {
  if (multiple) {
    const picked = options.filter((option) => (value ?? []).includes(option.id))
    if (!picked.length) return placeholder
    return picked.map((option) => option.label).join(', ')
  }
  return options.find((option) => option.id === value)?.label || placeholder
}

export function isSelected(value, id, multiple) {
  if (multiple) return (value ?? []).includes(id)
  return value === id
}

export function nextValue(value, id, multiple) {
  if (!multiple) return id
  const current = value ?? []
  return current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
}
