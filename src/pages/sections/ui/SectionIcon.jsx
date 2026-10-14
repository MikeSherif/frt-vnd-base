export function SectionIcon({ name }) {
  if (name === 'zip') {
    return (
      <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
        <path d="M12 6h12l8 8v20a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M24 6v8h8" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M18 16h2v2h-2zm2 2h2v2h-2zm-2 2h2v2h-2zm2 2h2v2h-2zm-2 2h2v4h4v-4h-2" fill="currentColor" />
      </svg>
    )
  }
  if (name === 'stack') {
    return (
      <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
        <path d="M14 10h14l6 6v16H14V10z" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 14H10v18h18v-2" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M28 10v6h6" fill="none" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    )
  }
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
      <path d="M13 6h12l8 8v20a2 2 0 0 1-2 2H13a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M25 6v8h8" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M16 22h10M16 26h10M16 30h6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      {name === 'lock' ? (
        <g transform="translate(22 22)">
          <rect x="2" y="7" width="12" height="9" rx="1.5" fill="#fff" stroke="currentColor" strokeWidth="1.4" />
          <path d="M5 7V5a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </g>
      ) : null}
    </svg>
  )
}
