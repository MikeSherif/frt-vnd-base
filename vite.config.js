import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const pdfjsDist = path.resolve('node_modules/react-pdf/node_modules/pdfjs-dist')

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      'pdfjs-dist': pdfjsDist,
    },
  },
  server: {
    port: 5173,
  },
})
