import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { XPBadge } from '../XPBadge/XPBadge'
import { SettingsModal } from '../Settings/SettingsModal'
import styles from './Header.module.css'

export function Header() {
  const { project, setProjectName, creativeMode, challengeMode, setChallengeMode } = useApp()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(project.projectName)
  const [showSettings, setShowSettings] = useState(false)

  const saveName = () => {
    const t = name.trim()
    if (t) setProjectName(t)
    setEditing(false)
  }

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          {editing ? (
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={saveName}
              onKeyDown={e => { if (e.key === 'Enter') saveName(); if (e.key === 'Escape') { setName(project.projectName); setEditing(false) } }}
              className={styles.nameInput}
            />
          ) : (
            <button
              type="button"
              className={styles.projectName}
              onClick={() => setEditing(true)}
              title="Rename project"
            >
              {project.projectName}
            </button>
          )}
          {creativeMode && <span className={styles.creativeBadge} aria-hidden>✨</span>}
        </div>
        <div className={styles.right}>
          <XPBadge />
          <button
            type="button"
            className={`${styles.challengeBtn} ${challengeMode ? styles.challengeBtnActive : ''}`}
            onClick={() => setChallengeMode(!challengeMode)}
            aria-pressed={challengeMode}
            title="Challenges"
          >
            🎯
          </button>
          <button
            type="button"
            className={styles.settingsBtn}
            onClick={() => setShowSettings(true)}
            aria-label="Settings"
            title="Settings"
          >
            ⚙
          </button>
        </div>
      </header>
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}
