import type { FileNode, FolderNode, TreeNode } from '../types'

const STORAGE_KEY = 'codesphere-project'
const ROOT_ID = 'root'

function defaultProject(): { rootId: string; nodes: Record<string, TreeNode>; openFileId: string | null; projectName: string } {
  const indexId = 'file-index'
  const styleId = 'file-style'
  const root: FolderNode = {
    id: ROOT_ID,
    name: 'project',
    kind: 'folder',
    parentId: null,
    childrenIds: [indexId, styleId]
  }
  const indexHtml: FileNode = {
    id: indexId,
    name: 'index.html',
    kind: 'file',
    ext: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>My Page</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Hello CodeSphere</h1>
  <p>Edit this file and style.css — see live preview.</p>
</body>
</html>`,
    parentId: ROOT_ID
  }
  const styleCss: FileNode = {
    id: styleId,
    name: 'style.css',
    kind: 'file',
    ext: 'css',
    content: `body {
  font-family: system-ui, sans-serif;
  margin: 2rem;
  background: #0f0f1a;
  color: #e0e0e0;
}

h1 {
  color: #6366f1;
}`,
    parentId: ROOT_ID
  }
  return {
    rootId: ROOT_ID,
    nodes: { [ROOT_ID]: root, [indexId]: indexHtml, [styleId]: styleCss },
    openFileId: indexId,
    projectName: 'My Project'
  }
}

export function loadProject(): { rootId: string; nodes: Record<string, TreeNode>; openFileId: string | null; projectName: string } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultProject()
    const parsed = JSON.parse(raw)
    if (!parsed.nodes || !parsed.rootId) return defaultProject()
    return {
      rootId: parsed.rootId,
      nodes: parsed.nodes,
      openFileId: parsed.openFileId ?? null,
      projectName: parsed.projectName ?? 'My Project'
    }
  } catch {
    return defaultProject()
  }
}

export function saveProject(state: { rootId: string; nodes: Record<string, TreeNode>; openFileId: string | null; projectName: string }) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function generateId(): string {
  return 'n-' + Math.random().toString(36).slice(2, 11)
}

export function getExtension(name: string): 'html' | 'css' | null {
  const lower = name.toLowerCase()
  if (lower.endsWith('.html')) return 'html'
  if (lower.endsWith('.css')) return 'css'
  return null
}

export function getAllCssContent(nodes: Record<string, TreeNode>, rootId: string): string {
  const css: string[] = []
  function walk(id: string) {
    const n = nodes[id]
    if (!n) return
    if (n.kind === 'file' && n.ext === 'css') css.push(n.content)
    if (n.kind === 'folder') n.childrenIds.forEach(walk)
  }
  walk(rootId)
  return css.join('\n\n')
}

export function getIndexHtmlContent(nodes: Record<string, TreeNode>, rootId: string): string {
  let found = ''
  function walk(id: string) {
    const n = nodes[id]
    if (!n) return
    if (n.kind === 'file' && n.name === 'index.html') {
      found = n.content
      return
    }
    if (n.kind === 'folder' && !found) n.childrenIds.forEach(walk)
  }
  walk(rootId)
  return found || '<body><p>No index.html found.</p></body>'
}

export function buildPreviewHtml(htmlContent: string, cssContent: string): string {
  const hasHead = /<head[\s>]/i.test(htmlContent)
  const hasLinkToCss = /<link[^>]*href\s*=\s*["']?style\.css["']?/i.test(htmlContent)
  let out = htmlContent
  const styleBlock = `<style>${cssContent}</style>`
  if (hasLinkToCss) {
    out = out.replace(/<link[^>]*href\s*=\s*["']?style\.css["']?[^>]*>/gi, styleBlock)
  } else if (hasHead) {
    out = out.replace(/(<head[^>]*>)/i, `$1\n${styleBlock}`)
  } else {
    out = out.replace(/(<html[^>]*>)/i, `$1\n<head>${styleBlock}</head>`)
  }
  return out
}
