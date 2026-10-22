export function fieldDescribedBy(hint, error, hintId, errorId) {
  return [hint ? hintId : undefined, error ? errorId : undefined].filter(Boolean).join(' ') || undefined
}
