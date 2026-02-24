import { useState } from 'react'
import type { TreeNode } from '../../types'
import { useApp } from '../../context/AppContext'
import { FileTreeItem } from './FileTreeItem'
import styles from './FileTree.module.css'

export function FileTree() {
  const { project, addFile, addFolder } = useApp()
  const [newFolderName, setNewFolderName] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [addType, setAddType] = useState<'file' | 'folder'>('file')
  const root = project.nodes[project.rootId]
  if (!root || root.kind !== 'folder') return null

  const handleAdd = (name: string) => {
    const trimmed = name.trim()
    if (addType === 'file') {
      const finalName = trimmed.endsWith('.html') || trimmed.endsWith('.css') ? trimmed : trimmed ? trimmed + '.html' : 'page.html'
      addFile(project.rootId, finalName)
    } else {
      addFolder(project.rootId, trimmed || 'New Folder')
    }
    setNewFolderName('')
    setShowAdd(false)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>Files</span>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => { setAddType('file'); setShowAdd(true) }}
            title="Add file"
            aria-label="Add file"
          >
            +
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => { setAddType('folder'); setShowAdd(true) }}
            title="Add folder"
            aria-label="Add folder"
          >
            📁
          </button>
        </div>
      </div>
      {showAdd && (
        <div className={styles.addRow}>
          <input
            autoFocus
            value={newFolderName}
            onChange={e => setNewFolderName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd(newFolderName.trim() || (addType === 'file' ? 'page.html' : 'New Folder'))
              if (e.key === 'Escape') { setShowAdd(false); setNewFolderName('') }
            }}
            placeholder={addType === 'file' ? 'name.html or name.css' : 'Folder name'}
            className={styles.input}
          />
          <button type="button" className={styles.confirmBtn} onClick={() => handleAdd(newFolderName.trim() || (addType === 'file' ? 'page.html' : 'New Folder'))}>Add</button>
        </div>
      )}
      <nav className={styles.tree} aria-label="Project files">
        <div className={styles.rootFolder}>
          <span className={styles.folderIcon}>▼</span>
          <span className={styles.folderName}>{root.name}</span>
        </div>
        {(root.childrenIds as string[]).map(id => {
          const node = project.nodes[id] as TreeNode | undefined
          return node ? <FileTreeItem key={node.id} node={node} depth={1} /> : null
        })}
      </nav>
    </div>
  )
}
