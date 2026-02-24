import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import styles from './SettingsModal.module.css'

type SettingsTab = 'general' | 'achievements'

export function SettingsModal({ onClose }: { onClose: () => void }) {
  const { creativeMode, setCreativeMode, achievements, persist, addXp, unlockAchievement } = useApp()
  const [tab, setTab] = useState<SettingsTab>('general')

  const handleSave = () => {
    persist()
    addXp(10)
    unlockAchievement('first-save')
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Settings">
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Settings</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className={styles.tabs}>
          <button type="button" className={tab === 'general' ? styles.tabActive : styles.tab} onClick={() => setTab('general')}>General</button>
          <button type="button" className={tab === 'achievements' ? styles.tabActive : styles.tab} onClick={() => setTab('achievements')}>Achievements</button>
        </div>
        <div className={styles.body}>
          {tab === 'general' && (
            <div className={styles.section}>
              <label className={styles.toggleRow}>
                <span className={styles.toggleLabel}>Creative Mode</span>
                <input
                  type="checkbox"
                  checked={creativeMode}
                  onChange={e => setCreativeMode(e.target.checked)}
                  className={styles.checkbox}
                />
                <span className={styles.slider} />
              </label>
              <p className={styles.hint}>Playful theme and subtle animations.</p>
              <button type="button" className={styles.saveBtn} onClick={handleSave}>Save project (+10 XP)</button>
            </div>
          )}
          {tab === 'achievements' && (
            <div className={styles.achievements}>
              {achievements.map(a => (
                <div key={a.id} className={styles.achievement} data-unlocked={!!a.unlockedAt}>
                  <span className={styles.achIcon}>{a.icon}</span>
                  <div className={styles.achText}>
                    <strong>{a.title}</strong>
                    <span>{a.description}</span>
                    {a.unlockedAt ? <span className={styles.achXp}>+{a.xp} XP</span> : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
