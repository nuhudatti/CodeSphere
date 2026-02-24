import { useApp } from '../../context/AppContext'
import { playPreviewTick } from '../../utils/sound'
import styles from './RunFAB.module.css'

export function RunFAB() {
  const { setTab, triggerCelebration, creativeMode } = useApp()

  const handleRun = () => {
    setTab('preview')
    playPreviewTick()
    triggerCelebration()
  }

  return (
    <button
      type="button"
      className={`${styles.fab} ${creativeMode ? styles.creative : ''}`}
      onClick={handleRun}
      aria-label="Run and preview"
      title="Run"
    >
      <span className={styles.icon}>▶</span>
      <span className={styles.text}>Run</span>
    </button>
  )
}
