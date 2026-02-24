import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react'
import type { FolderNode, ProjectState, TabId, TreeNode } from '../types'
import {
  loadProject,
  saveProject,
  generateId,
  getExtension,
  buildPreviewHtml,
  getIndexHtmlContent,
  getAllCssContent
} from '../store/files'
import {
  getStoredXp,
  getStoredAchievements,
  saveXp,
  saveLevel,
  saveAchievements,
  xpToLevel,
  xpProgressInLevel,
  type Achievement
} from '../store/gamification'
import { CHALLENGE_LEVELS, getStoredChallengeLevel, setStoredChallengeLevel } from '../store/challenges'

interface AppContextValue {
  project: ProjectState
  setProjectName: (name: string) => void
  setOpenFile: (id: string | null) => void
  openFile: (id: string) => void
  updateFileContent: (id: string, content: string) => void
  addFile: (parentId: string, name: string) => string | null
  addFolder: (parentId: string, name: string) => string | null
  deleteNode: (id: string) => void
  renameNode: (id: string, name: string) => boolean
  previewHtml: string
  persist: () => void
  tab: TabId
  setTab: (t: TabId) => void
  xp: number
  level: number
  xpProgress: { level: number; current: number; needed: number }
  achievements: Achievement[]
  addXp: (amount: number) => void
  unlockAchievement: (id: string) => void
  creativeMode: boolean
  setCreativeMode: (on: boolean) => void
  lastCelebration: number
  triggerCelebration: () => void
  challengeLevel: number
  setChallengeLevel: (n: number) => void
  challengeMode: boolean
  setChallengeMode: (on: boolean) => void
  previewFrameRef: RefObject<HTMLIFrameElement | null>
  checkChallenge: () => boolean
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  // Define addXp and unlockAchievement first so addFile can use them
  const [xp, setXpState] = useState(getStoredXp)
  const [achievements, setAchievementsState] = useState(getStoredAchievements)

  const addXp = useCallback((amount: number) => {
    setXpState(prev => {
      const next = prev + amount
      saveXp(next)
      const newLevel = xpToLevel(next)
      const oldLevel = xpToLevel(prev)
      if (newLevel > oldLevel) saveLevel(newLevel)
      return next
    })
  }, [])

  const unlockAchievement = useCallback((id: string) => {
    setAchievementsState(prev => {
      const a = prev.find(x => x.id === id)
      if (!a || a.unlockedAt != null) return prev
      const updated = prev.map(x => x.id === id ? { ...x, unlockedAt: Date.now() } : x)
      saveAchievements(updated)
      const ach = prev.find(x => x.id === id)
      if (ach) addXp(ach.xp)
      return updated
    })
  }, [addXp])

  const [project, setProjectState] = useState<ProjectState>(loadProject)
  const [tab, setTab] = useState<TabId>('editor')
  const [creativeMode, setCreativeModeState] = useState(() => localStorage.getItem('codesphere-creative') === '1')
  const [lastCelebration, setLastCelebration] = useState(0)
  const [challengeLevel, setChallengeLevelState] = useState(getStoredChallengeLevel)
  const [challengeMode, setChallengeModeState] = useState(false)
  const previewFrameRef = useRef<HTMLIFrameElement | null>(null)

  const level = useMemo(() => xpToLevel(xp), [xp])
  const xpProgress = useMemo(() => xpProgressInLevel(xp), [xp])

  const persist = useCallback(() => {
    saveProject(project)
  }, [project])

  const setProjectName = useCallback((name: string) => {
    setProjectState(p => ({ ...p, projectName: name }))
  }, [])

  const setOpenFile = useCallback((id: string | null) => {
    setProjectState(p => ({ ...p, openFileId: id }))
  }, [])

  const openFile = useCallback((id: string) => {
    setProjectState(p => ({ ...p, openFileId: id }))
    setTab('editor')
  }, [])

  const updateFileContent = useCallback((id: string, content: string) => {
    setProjectState(p => {
      const n = p.nodes[id]
      if (!n || n.kind !== 'file') return p
      const next = { ...p.nodes, [id]: { ...n, content } }
      return { ...p, nodes: next }
    })
  }, [])

  const addFile = useCallback((parentId: string, name: string): string | null => {
    const ext = getExtension(name)
    if (!ext) return null
    const parent = project.nodes[parentId] as { kind: 'folder'; childrenIds: string[] } | undefined
    if (!parent || parent.kind !== 'folder') return null
    const id = generateId()
    const newNode: TreeNode = {
      id,
      name,
      kind: 'file',
      ext,
      content: ext === 'html' ? '<!DOCTYPE html>\n<html>\n<head>\n  <link rel="stylesheet" href="style.css" />\n</head>\n<body>\n</body>\n</html>' : '/* your styles */',
      parentId: parentId
    }
    addXp(5)
    unlockAchievement('first-file')
    setProjectState(p => {
      const parentNode = p.nodes[parentId] as FolderNode | undefined
      if (!parentNode || parentNode.kind !== 'folder') return p
      const updatedParent: FolderNode = { ...parentNode, childrenIds: [...parentNode.childrenIds, id] }
      return {
        ...p,
        nodes: { ...p.nodes, [id]: newNode, [parentId]: updatedParent },
        openFileId: id
      }
    })
    setTab('editor')
    return id
  }, [project.nodes, addXp, unlockAchievement])

  const addFolder = useCallback((parentId: string, name: string): string | null => {
    const parent = project.nodes[parentId] as { kind: 'folder'; childrenIds: string[] } | undefined
    if (!parent || parent.kind !== 'folder') return null
    const id = generateId()
    const newFolder: TreeNode = {
      id,
      name: name.trim() || 'New Folder',
      kind: 'folder',
      parentId: parentId,
      childrenIds: []
    }
    setProjectState(p => {
      const parentNode = p.nodes[parentId] as FolderNode | undefined
      if (!parentNode || parentNode.kind !== 'folder') return p
      const updatedParent: FolderNode = { ...parentNode, childrenIds: [...parentNode.childrenIds, id] }
      return {
        ...p,
        nodes: { ...p.nodes, [id]: newFolder, [parentId]: updatedParent }
      }
    })
    return id
  }, [project.nodes])

  const deleteNode = useCallback((id: string) => {
    if (id === project.rootId) return
    const n = project.nodes[id]
    if (!n) return
    const toRemove = new Set<string>()
    function collect(nodeId: string) {
      const node = project.nodes[nodeId]
      if (!node) return
      toRemove.add(nodeId)
      if (node.kind === 'folder') (node as FolderNode).childrenIds.forEach(collect)
    }
    collect(id)
    const parent = n.parentId ? project.nodes[n.parentId] as FolderNode | undefined : null
    setProjectState(p => {
      const next = { ...p.nodes }
      toRemove.forEach(nodeId => delete next[nodeId])
      if (parent && parent.kind === 'folder' && next[parent.id]) {
        const pNode = next[parent.id] as FolderNode
        next[parent.id] = { ...pNode, childrenIds: pNode.childrenIds.filter(x => x !== id) }
      }
      const openFileId = toRemove.has(p.openFileId ?? '') ? null : p.openFileId
      return { ...p, nodes: next, openFileId }
    })
  }, [project.nodes, project.rootId, project.openFileId])

  const renameNode = useCallback((id: string, name: string): boolean => {
    const n = project.nodes[id]
    if (!n) return false
    if (n.kind === 'file') {
      const ext = getExtension(name)
      if (!ext) return false
    }
    setProjectState(p => ({ ...p, nodes: { ...p.nodes, [id]: { ...n, name } } }))
    return true
  }, [project.nodes])

  const previewHtml = useMemo(() => {
    const html = getIndexHtmlContent(project.nodes, project.rootId)
    const css = getAllCssContent(project.nodes, project.rootId)
    return buildPreviewHtml(html, css)
  }, [project.nodes, project.rootId])

  const setCreativeMode = useCallback((on: boolean) => {
    setCreativeModeState(on)
    localStorage.setItem('codesphere-creative', on ? '1' : '0')
  }, [])

  const triggerCelebration = useCallback(() => {
    setLastCelebration(Date.now())
  }, [])

  const setChallengeLevel = useCallback((n: number) => {
    setChallengeLevelState(n)
    setStoredChallengeLevel(n)
  }, [])

  const setChallengeMode = useCallback((on: boolean) => {
    setChallengeModeState(on)
  }, [])

  const checkChallenge = useCallback((): boolean => {
    const doc = previewFrameRef.current?.contentDocument
    if (!doc) return false
    const levelConfig = CHALLENGE_LEVELS.find(l => l.level === challengeLevel)
    return levelConfig ? levelConfig.check(doc) : false
  }, [challengeLevel])

  const value: AppContextValue = useMemo(
    () => ({
      project,
      setProjectName,
      setOpenFile,
      openFile,
      updateFileContent,
      addFile,
      addFolder,
      deleteNode,
      renameNode,
      previewHtml,
      persist,
      tab,
      setTab,
      xp,
      level,
      xpProgress,
      achievements,
      addXp,
      unlockAchievement,
      creativeMode,
      setCreativeMode,
      lastCelebration,
      triggerCelebration,
      challengeLevel,
      setChallengeLevel,
      challengeMode,
      setChallengeMode,
      previewFrameRef,
      checkChallenge
    }),
    [
      project,
      previewHtml,
      tab,
      xp,
      level,
      xpProgress,
      achievements,
      creativeMode,
      lastCelebration,
      challengeLevel,
      challengeMode,
      setProjectName,
      setOpenFile,
      openFile,
      updateFileContent,
      addFile,
      addFolder,
      deleteNode,
      renameNode,
      persist,
      setTab,
      addXp,
      unlockAchievement,
      setCreativeMode,
      triggerCelebration,
      setChallengeLevel,
      setChallengeMode,
      checkChallenge
    ]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
