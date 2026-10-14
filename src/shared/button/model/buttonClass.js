export function buttonClass(variant = 'primary') {
  if (variant === 'secondary') return 'vnd-btn secondary'
  if (variant === 'ghost') return 'vnd-btn ghost'
  return 'vnd-btn'
}
