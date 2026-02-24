import { useApp } from '../../context/AppContext'
import styles from './XPBadge.module.css'

export function XPBadge() {
  const { xp, xpProgress } = useApp()
  const { level, current, needed } = xpProgress
  const pct = needed > 0 ? (current / needed) * 100 : 0

  return (
    <div className={styles.wrapper} title={`Level ${level} · ${current}/${needed} XP`}>
      <div className={styles.ring} style={{ ['--pct' as string]: pct }}>
        <span className={styles.level}>{level}</span>
      </div>
      <span className={styles.xp}>{xp} XP</span>
    </div>
  )
}
