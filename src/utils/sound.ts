let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  return ctx
}

export function playPreviewTick() {
  const c = getCtx()
  if (!c) return
  try {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)
    osc.frequency.setValueAtTime(520, c.currentTime)
    osc.frequency.exponentialRampToValueAtTime(640, c.currentTime + 0.06)
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.08, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.12)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + 0.12)
  } catch (_) {}
}

export function playAchievement() {
  const c = getCtx()
  if (!c) return
  try {
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)
    osc.frequency.setValueAtTime(392, c.currentTime)
    osc.frequency.setValueAtTime(523, c.currentTime + 0.1)
    osc.frequency.setValueAtTime(659, c.currentTime + 0.2)
    osc.type = 'sine'
    gain.gain.setValueAtTime(0.12, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + 0.35)
  } catch (_) {}
}
