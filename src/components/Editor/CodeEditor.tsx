import { useCallback } from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css'
import { useApp } from '../../context/AppContext'
import { checkCssAchievements, checkFileCountAchievement } from '../../utils/achievementCheck'
import styles from './CodeEditor.module.css'

export function CodeEditor() {
  const { project, updateFileContent, unlockAchievement } = useApp()
  const openFileId = project.openFileId
  const openFile = openFileId ? project.nodes[openFileId] : null
  const isHtml = openFile?.kind === 'file' && (openFile as { ext: string }).ext === 'html'
  const isCss = openFile?.kind === 'file' && (openFile as { ext: string }).ext === 'css'
  const content = openFile?.kind === 'file' ? (openFile as { content: string }).content : ''
  const extensions = isHtml ? [html()] : isCss ? [css()] : []
  const onChange = useCallback(
    (value: string) => {
      if (!openFileId) return
      updateFileContent(openFileId, value)
      if (isCss) {
        checkCssAchievements(value, unlockAchievement)
      }
      const fileCount = Object.values(project.nodes).filter(n => n.kind === 'file').length
      checkFileCountAchievement(fileCount, unlockAchievement)
    },
    [openFileId, updateFileContent, isCss, unlockAchievement, project.nodes]
  )


  if (!openFile || openFile.kind !== 'file') {
    return (
      <div className={styles.empty}>
        <p>Select a file from the tree or add one.</p>
        <p className={styles.hint}>Only .html and .css files are supported.</p>
      </div>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.bar}>
        <span className={styles.filename}>{openFile.name}</span>
      </div>
      <CodeMirror
        value={content}
        height="100%"
        extensions={extensions}
        onChange={onChange}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightActiveLine: true,
          foldGutter: true,
          indentOnInput: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true
        }}
        theme="dark"
        className={styles.editor}
      />
    </div>
  )
}
