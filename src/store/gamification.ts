import type { Achievement } from '../types'

export type { Achievement }

const XP_STORAGE = 'codesphere-xp'
const LEVEL_STORAGE = 'codesphere-level'
const ACHIEVEMENTS_STORAGE = 'codesphere-achievements'
const CREATIVE_MODE_STORAGE = 'codesphere-creative'

const XP_PER_LEVEL = 100
const LEVEL_MULTIPLIER = 1.2

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-file', title: 'First File', description: 'Created your first file', icon: '📄', unlockedAt: null, xp: 5 },
  { id: 'first-button', title: 'Styled Button', description: 'Styled your first button', icon: '🔘', unlockedAt: null, xp: 10 },
  { id: 'flexbox', title: 'Flex Master', description: 'Used Flexbox', icon: '📐', unlockedAt: null, xp: 15 },
  { id: 'grid', title: 'Grid Explorer', description: 'Used CSS Grid', icon: '▦', unlockedAt: null, xp: 20 },
  { id: 'first-save', title: 'Saver', description: 'Saved your project', icon: '💾', unlockedAt: null, xp: 10 },
  { id: 'five-files', title: 'File Collector', description: 'Created 5 files', icon: '📁', unlockedAt: null, xp: 25 },
  { id: 'ten-rules', title: 'CSS Crafter', description: 'Added 10+ CSS rules', icon: '🎨', unlockedAt: null, xp: 30 }
]

export function getStoredXp(): number {
  const v = localStorage.getItem(XP_STORAGE)
  return v ? Math.max(0, parseInt(v, 10)) : 0
}

export function getStoredLevel(): number {
  const v = localStorage.getItem(LEVEL_STORAGE)
  return v ? Math.max(1, parseInt(v, 10)) : 1
}

export function getStoredAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE)
    if (!raw) return ACHIEVEMENTS.map(a => ({ ...a }))
    const parsed = JSON.parse(raw)
    return ACHIEVEMENTS.map(a => {
      const p = parsed.find((x: Achievement) => x.id === a.id)
      return p ? { ...a, unlockedAt: p.unlockedAt } : { ...a }
    })
  } catch {
    return ACHIEVEMENTS.map(a => ({ ...a }))
  }
}

export function saveXp(xp: number) {
  localStorage.setItem(XP_STORAGE, String(Math.max(0, xp)))
}

export function saveLevel(level: number) {
  localStorage.setItem(LEVEL_STORAGE, String(Math.max(1, level)))
}

export function saveAchievements(achievements: Achievement[]) {
  localStorage.setItem(ACHIEVEMENTS_STORAGE, JSON.stringify(achievements.map(a => ({ id: a.id, unlockedAt: a.unlockedAt }))))
}

export function xpToLevel(xp: number): number {
  let level = 1
  let needed = XP_PER_LEVEL
  let total = 0
  while (total + needed <= xp) {
    total += needed
    level++
    needed = Math.floor(needed * LEVEL_MULTIPLIER)
  }
  return level
}

export function xpProgressInLevel(xp: number): { level: number; current: number; needed: number } {
  let level = 1
  let needed = XP_PER_LEVEL
  let total = 0
  while (total + needed <= xp) {
    total += needed
    level++
    needed = Math.floor(needed * LEVEL_MULTIPLIER)
  }
  return { level, current: xp - total, needed }
}

export function getCreativeMode(): boolean {
  return localStorage.getItem(CREATIVE_MODE_STORAGE) === '1'
}

export function setCreativeMode(on: boolean) {
  localStorage.setItem(CREATIVE_MODE_STORAGE, on ? '1' : '0')
}
