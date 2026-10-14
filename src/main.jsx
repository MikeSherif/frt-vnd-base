import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRouter } from './app/providers/router'
import './app/styles/global.css'

createRoot(document.getElementById('vnd-root')).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>,
)
