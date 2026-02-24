import { useEffect, useRef, useState } from 'react'
import { useApp } from '../../context/AppContext'
import { playPreviewTick } from '../../utils/sound'
import styles from './LivePreview.module.css'

const DEBOUNCE_MS = 300

export function LivePreview() {
  const { previewHtml, triggerCelebration, creativeMode, previewFrameRef } = useApp()
  const prevHtmlRef = useRef('')
  const [debouncedHtml, setDebouncedHtml] = useState(previewHtml)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedHtml(previewHtml), DEBOUNCE_MS)
    return () => clearTimeout(t)
  }, [previewHtml])

  useEffect(() => {
    const el = previewFrameRef.current
    if (!el) return
    const doc = el.contentDocument
    if (!doc) return
    doc.open()
    doc.write(debouncedHtml)
    doc.close()
    if (prevHtmlRef.current && prevHtmlRef.current !== debouncedHtml) {
      playPreviewTick()
      triggerCelebration()
    }
    prevHtmlRef.current = debouncedHtml
  }, [debouncedHtml, triggerCelebration, previewFrameRef])

  return (
    <div className={`${styles.wrapper} ${creativeMode ? styles.creative : ''}`}>
      <div className={styles.bar}>
        <span className={styles.label}>Live Preview</span>
      </div>
      <div className={styles.frameWrap}>
        <iframe
          ref={previewFrameRef}
          title="Preview"
          className={styles.iframe}
          sandbox="allow-same-origin"
        />
      </div>
    </div>
  )
}
