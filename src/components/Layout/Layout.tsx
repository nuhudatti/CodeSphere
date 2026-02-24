import { useApp } from '../../context/AppContext'
import { Header } from '../Header/Header'
import { TabBar } from '../Tabs/TabBar'
import { FileTree } from '../FileTree/FileTree'
import { CodeEditor } from '../Editor/CodeEditor'
import { LivePreview } from '../Preview/LivePreview'
import { RunFAB } from '../RunFAB/RunFAB'
import { Celebration } from '../Celebration/Celebration'
import { ChallengePanel } from '../Challenges/ChallengePanel'
import styles from './Layout.module.css'

export function Layout() {
  const { tab, setTab, creativeMode, challengeMode } = useApp()

  return (
    <div className={`${styles.root} ${creativeMode ? styles.creative : ''}`}>
      <div className={styles.bg} aria-hidden />
      <div className={styles.app}>
        <Header />
        {challengeMode && (
          <div className={styles.challengeWrap}>
            <ChallengePanel />
          </div>
        )}
        <div className={styles.tabBarWrap}>
          <TabBar tab={tab} setTab={setTab} />
        </div>
        <main className={styles.main}>
          <div className={styles.sidebar} data-visible={tab === 'files'}>
            <FileTree />
          </div>
          <div className={styles.editorWrap} data-visible={tab === 'editor'}>
            <CodeEditor />
          </div>
          <div className={styles.previewWrap} data-visible={tab === 'preview'}>
            <LivePreview />
          </div>
        </main>
        <RunFAB />
      </div>
      <Celebration />
    </div>
  )
}
