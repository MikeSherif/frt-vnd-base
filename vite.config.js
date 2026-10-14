import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const pdfjsDist = path.resolve('node_modules/react-pdf/node_modules/pdfjs-dist')

function basePath() {
  const raw = process.env.BASE_PATH
  if (!raw || raw === '.' || raw === './') return './'
  return raw.endsWith('/') ? raw : `${raw}/`
}

export default defineConfig({
  plugins: [react()],
  base: basePath(),
  resolve: {
    alias: {
      'pdfjs-dist': pdfjsDist,
    },
  },
  server: {
    port: 5173,
  },
})
