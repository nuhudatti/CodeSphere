export function checkCssAchievements(content: string, unlock: (id: string) => void) {
  if (/\bbutton\b.*\{|\[.*\].*\{/.test(content) || /<button/i.test(content)) unlock('first-button')
  if (/\bdisplay\s*:\s*flex|display\s*:\s*inline-flex/.test(content)) unlock('flexbox')
  if (/\bdisplay\s*:\s*grid|grid-template/.test(content)) unlock('grid')
  const rules = (content.match(/\{[^}]*\}/g) || []).length
  if (rules >= 10) unlock('ten-rules')
}

export function checkFileCountAchievement(fileCount: number, unlock: (id: string) => void) {
  if (fileCount >= 5) unlock('five-files')
}
