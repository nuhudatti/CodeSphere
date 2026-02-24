import { useEffect, useState } from 'react'
import { useApp } from '../../context/AppContext'
import styles from './Celebration.module.css'

const DURATION = 1200

export function Celebration() {
  const { lastCelebration } = useApp()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!lastCelebration) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), DURATION)
    return () => clearTimeout(t)
  }, [lastCelebration])

  if (!visible) return null

  return (
    <div className={styles.wrapper} aria-hidden>
      <div className={styles.burst} />
      <div className={styles.particles}>
        {[...Array(12)].map((_, i) => (
          <span key={i} className={styles.particle} style={{ ['--i' as string]: i }} />
        ))}
      </div>
      <span className={styles.check}>✓</span>
    </div>
  )
}
