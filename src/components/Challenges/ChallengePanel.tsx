import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { CHALLENGE_LEVELS } from '../../store/challenges'
import { playAchievement } from '../../utils/sound'
import styles from './ChallengePanel.module.css'

export function ChallengePanel() {
  const { challengeLevel, setChallengeLevel, checkChallenge, addXp, triggerCelebration } = useApp()
  const [showHint, setShowHint] = useState(false)
  const [justPassed, setJustPassed] = useState(false)
  const [message, setMessage] = useState<'idle' | 'pass' | 'fail'>('idle')

  const current = CHALLENGE_LEVELS.find(l => l.level === challengeLevel)
  const isLast = challengeLevel >= CHALLENGE_LEVELS.length

  const handleCheck = () => {
    const passed = checkChallenge()
    if (passed) {
      setMessage('pass')
      setJustPassed(true)
      playAchievement()
      triggerCelebration()
      addXp(15)
    } else {
      setMessage('fail')
      setTimeout(() => setMessage('idle'), 1500)
    }
  }

  const handleNext = () => {
    setJustPassed(false)
    setMessage('idle')
    if (!isLast) setChallengeLevel(challengeLevel + 1)
  }

  if (!current) return null

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.badge}>Level {current.level}</span>
        <h3 className={styles.title}>{current.title}</h3>
      </div>
      <p className={styles.goal}>{current.goal}</p>
      <button
        type="button"
        className={styles.hintBtn}
        onClick={() => setShowHint(!showHint)}
        aria-expanded={showHint}
      >
        {showHint ? 'Hide hint' : 'Show hint'}
      </button>
      {showHint && <p className={styles.hint}>{current.hint}</p>}
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.checkBtn}
          onClick={handleCheck}
          disabled={message === 'pass'}
        >
          {message === 'pass' ? '✓ Passed!' : 'Check'}
        </button>
        {justPassed && (
          <button type="button" className={styles.nextBtn} onClick={handleNext}>
            {isLast ? 'Finish' : 'Next level →'}
          </button>
        )}
      </div>
      {message === 'fail' && <p className={styles.fail}>Not yet — keep trying! Preview updates as you type.</p>}
      <p className={styles.tip}>Switch to Editor to code, then Preview to see it. Check when ready.</p>
    </div>
  )
}
