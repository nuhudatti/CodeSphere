import { useState } from 'react'
import type { FileNode, FolderNode, TreeNode } from '../../types'
import { useApp } from '../../context/AppContext'
import styles from './FileTree.module.css'

export function FileTreeItem({ node, depth }: { node: TreeNode; depth: number }) {
  const { project, openFile, deleteNode, renameNode, addFile, addFolder } = useApp()
  const [expanded, setExpanded] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState(node.name)
  const [showAdd, setShowAdd] = useState(false)
  const [addName, setAddName] = useState('')

  const handleRename = () => {
    if (editName.trim() && editName !== node.name) {
      if (node.kind === 'file') {
        const hasExt = editName.endsWith('.html') || editName.endsWith('.css')
        renameNode(node.id, hasExt ? editName : editName + (node.ext === 'html' ? '.html' : '.css'))
      } else {
        renameNode(node.id, editName.trim())
      }
    }
    setEditing(false)
    setEditName(node.name)
  }

  const handleAdd = (type: 'file' | 'folder') => {
    const trimmed = addName.trim()
    if (type === 'file') {
      const name = trimmed.endsWith('.html') || trimmed.endsWith('.css') ? trimmed : trimmed ? trimmed + '.html' : 'page.html'
      addFile(node.id, name)
    } else {
      addFolder(node.id, trimmed || 'New Folder')
    }
    setAddName('')
    setShowAdd(false)
  }

  if (node.kind === 'file') {
    const f = node as FileNode
    return (
      <div className={styles.item} style={{ paddingLeft: depth * 12 + 8 }}>
        {editing ? (
          <input
            autoFocus
            value={editName}
            onChange={e => setEditName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') { setEditing(false); setEditName(node.name) } }}
            className={styles.input}
          />
        ) : (
          <>
            <button
              type="button"
              className={styles.fileRow}
              onClick={() => openFile(node.id)}
              onDoubleClick={() => setEditing(true)}
              data-active={project.openFileId === node.id}
            >
              <span className={styles.fileIcon}>{f.ext === 'html' ? '📄' : '🎨'}</span>
              <span className={styles.fileName}>{node.name}</span>
            </button>
            <button
              type="button"
              className={styles.deleteBtn}
              onClick={() => deleteNode(node.id)}
              title="Delete"
              aria-label="Delete file"
            >
              ×
            </button>
          </>
        )}
      </div>
    )
  }

  return (
    <div className={styles.folderBlock}>
      <div className={styles.item} style={{ paddingLeft: depth * 12 + 8 }}>
        <button
          type="button"
          className={styles.folderRow}
          onClick={() => setExpanded(e => !e)}
          aria-expanded={expanded}
        >
          <span className={styles.folderIcon}>{expanded ? '▼' : '▶'}</span>
          {editing ? (
            <input
              autoFocus
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={e => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') { setEditing(false); setEditName(node.name) } }}
              onClick={e => e.stopPropagation()}
              className={styles.input}
            />
          ) : (
            <>
              <span className={styles.folderName}>{node.name}</span>
              <button
                type="button"
                className={styles.deleteBtn}
                onClick={e => { e.stopPropagation(); deleteNode(node.id) }}
                title="Delete folder"
                aria-label="Delete folder"
              >
                ×
              </button>
              <button
                type="button"
                className={styles.renameBtn}
                onClick={e => { e.stopPropagation(); setEditing(true) }}
                title="Rename"
              >
                ✎
              </button>
            </>
          )}
        </button>
        <button
          type="button"
          className={styles.addInFolder}
          onClick={() => setShowAdd(s => !s)}
          aria-label="Add in folder"
        >
          +
        </button>
      </div>
      {showAdd && (
        <div className={styles.addRow} style={{ marginLeft: (depth + 1) * 12 + 8 }}>
          <input
            autoFocus
            value={addName}
            onChange={e => setAddName(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAdd(addName.includes('.') ? 'file' : 'folder')
              if (e.key === 'Escape') { setShowAdd(false); setAddName('') }
            }}
            placeholder="name.html or folder"
            className={styles.input}
          />
          <button type="button" className={styles.confirmBtn} onClick={() => handleAdd(addName.includes('.') ? 'file' : 'folder')}>Add</button>
        </div>
      )}
      {expanded && (
        <div className={styles.children}>
          {(node as FolderNode).childrenIds.map(childId => {
            const n = project.nodes[childId]
            return n ? <FileTreeItem key={n.id} node={n} depth={depth + 1} /> : null
          })}
        </div>
      )}
    </div>
  )
}
