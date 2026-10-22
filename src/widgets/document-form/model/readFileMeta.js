import { ALLOWED_EXTENSIONS, FILE_LIMIT_BYTES } from '../../../entities/document'

export async function readFileMeta(file) {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    throw new Error('Допустимы PDF, DOCX, Excel и изображения')
  }
  if (file.size > FILE_LIMIT_BYTES) {
    throw new Error('Файл больше 50 МБ')
  }
  const digest = await crypto.subtle.digest('SHA-256', await file.arrayBuffer())
  const hash = [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('')
  return {
    id: crypto.randomUUID(),
    name: file.name,
    mime: file.type || 'application/octet-stream',
    size: file.size,
    url: URL.createObjectURL(file),
    hash,
    isSignedOriginal: extension === 'pdf',
  }
}
