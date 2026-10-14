import { useEffect, useRef, useState } from 'react'
import { Document, Page } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { buttonClass } from '../../../shared/button'
import { isPdf } from '../model/setupPdf.js'
import styles from './PdfViewer.module.css'

export function PdfViewer({ file }) {
  const frameRef = useRef(null)
  const [meta, setMeta] = useState({ url: '', pages: 0 })
  const [page, setPage] = useState(1)
  const [scale, setScale] = useState(1)
  const [failed, setFailed] = useState(false)
  const pages = meta.url === file?.url ? meta.pages : 0

  useEffect(() => {
    setPage(1)
    setScale(1)
    setFailed(false)
  }, [file?.url])

  if (!file) {
    return <div className={styles.fallback}>Файл редакции не приложен.</div>
  }

  if (!isPdf(file) || !file.url) {
    return (
      <div className={styles.fallback}>
        <p>Предпросмотр доступен для PDF. Файл «{file.name}» можно скачать.</p>
        {file.url ? <a className={buttonClass()} href={file.url} download={file.name}>Скачать</a> : <p>Файл недоступен в этой демонстрации после обновления страницы.</p>}
      </div>
    )
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen()
    else frameRef.current?.requestFullscreen()
  }

  const thumbs = Math.min(pages, 40)

  return (
    <div className={styles.frame} ref={frameRef}>
      {failed ? <p className={styles.fallback}>Не удалось открыть PDF.</p> : (
        <Document
          key={file.url}
          file={file.url}
          onLoadSuccess={({ numPages }) => setMeta({ url: file.url, pages: numPages })}
          onLoadError={() => setFailed(true)}
          loading={<p className={styles.fallback}>Открываем документ…</p>}
        >
          <div className={styles.body}>
            <aside className={styles.thumbs} aria-label="Страницы">
              {Array.from({ length: thumbs }, (_, index) => {
                const number = index + 1
                return (
                  <button
                    key={number}
                    type="button"
                    className={number === page ? styles.thumbOn : styles.thumb}
                    onClick={() => setPage(number)}
                  >
                    <Page pageNumber={number} width={72} renderTextLayer={false} renderAnnotationLayer={false} />
                    <span>{number}</span>
                  </button>
                )
              })}
            </aside>
            <div className={styles.stage}>
              <Page pageNumber={page} width={Math.round(520 * scale)} />
              <div className={styles.zoom}>
                <button type="button" onClick={() => setPage((value) => Math.max(1, value - 1))} disabled={page <= 1}>←</button>
                <button type="button" onClick={() => setScale((value) => Math.max(0.6, Number((value - 0.2).toFixed(2))))}>−</button>
                <span>{Math.round(scale * 100)}%</span>
                <button type="button" onClick={() => setScale((value) => Math.min(2, Number((value + 0.2).toFixed(2))))}>+</button>
                <button type="button" onClick={() => setPage((value) => Math.min(pages || value, value + 1))} disabled={!pages || page >= pages}>→</button>
                <button type="button" onClick={toggleFullscreen}>На весь экран</button>
              </div>
            </div>
          </div>
        </Document>
      )}
    </div>
  )
}
