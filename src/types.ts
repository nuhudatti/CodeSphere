export type FileKind = 'html' | 'css'

export interface FileNode {
  id: string
  name: string
  kind: 'file'
  ext: FileKind
  content: string
  parentId: string | null
}

export interface FolderNode {
  id: string
  name: string
  kind: 'folder'
  parentId: string | null
  childrenIds: string[]
}

export type TreeNode = FileNode | FolderNode

export interface ProjectState {
  rootId: string
  nodes: Record<string, TreeNode>
  openFileId: string | null
  projectName: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlockedAt: number | null
  xp: number
}

export type TabId = 'files' | 'editor' | 'preview'
