import { pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString()

export function isPdf(file) {
  if (!file?.name && !file?.mime) return false
  return file.mime === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf')
}
