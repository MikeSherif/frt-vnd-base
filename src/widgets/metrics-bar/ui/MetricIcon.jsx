export function MetricIcon({ id }) {
  const extra = id === 'active' ? (
    <path d="M22 22.5l2.2 2.2 4-4.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  ) : null
  const archived = id === 'archived' ? (
    <path d="M24 20v7m0 0l-2.4-2.4M24 27l2.4-2.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  ) : null
  const review = id === 'review' ? (
    <g fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="24" cy="23" r="3.2" />
      <path d="M26.4 25.4L29 28" strokeLinecap="round" />
    </g>
  ) : null
  const pencil = id === 'updated30' ? (
    <path d="M21 26.5l6.2-6.2 1.8 1.8-6.2 6.2H21v-1.8z" fill="none" stroke="currentColor" strokeWidth="1.5" />
  ) : null
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true">
      <path d="M11 6h12l7 7v19a2 2 0 0 1-2 2H11a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M23 6v7h7" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M14 20h8M14 24h8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      {extra}
      {archived}
      {review}
      {pencil}
    </svg>
  )
}
