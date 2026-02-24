import type { TabId } from '../../types'
import styles from './TabBar.module.css'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'files', label: 'Files', icon: '📁' },
  { id: 'editor', label: 'Editor', icon: '✏️' },
  { id: 'preview', label: 'Preview', icon: '👁' }
]

export function TabBar({ tab, setTab }: { tab: TabId; setTab: (t: TabId) => void }) {
  return (
    <div className={styles.wrapper} role="tablist" aria-label="Sections">
      {TABS.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          className={styles.tab}
          data-active={tab === id}
          onClick={() => setTab(id)}
        >
          <span className={styles.icon}>{icon}</span>
          <span className={styles.label}>{label}</span>
        </button>
      ))}
    </div>
  )
}
