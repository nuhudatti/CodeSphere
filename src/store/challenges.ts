export interface ChallengeLevel {
  id: string
  level: number
  title: string
  goal: string
  hint: string
  /** Returns true if the preview document passes this level */
  check: (doc: Document) => boolean
}

const hasElement = (doc: Document, selector: string) => doc.querySelector(selector) !== null
const hasText = (doc: Document, selector: string, text: string) => {
  const el = doc.querySelector(selector)
  return el ? el.textContent?.toLowerCase().includes(text.toLowerCase()) : false
}
const hasStyle = (doc: Document, selector: string, prop: string, value: string | RegExp) => {
  const el = doc.querySelector(selector)
  if (!el) return false
  const style = (el as HTMLElement).style
  const computed = doc.defaultView?.getComputedStyle(el as Element)
  const val = (style as Record<string, string>)[prop] || computed?.getPropertyValue(prop.replace(/([A-Z])/g, '-$1').toLowerCase())
  return typeof value === 'string' ? val?.includes(value) : value.test(val || '')
}

export const CHALLENGE_LEVELS: ChallengeLevel[] = [
  {
    id: '1',
    level: 1,
    title: 'Hello World',
    goal: 'Add an <h1> heading that says "Hello World" in your index.html.',
    hint: 'Use <h1>Hello World</h1> inside the <body>.',
    check: (doc) => hasText(doc, 'h1', 'hello world')
  },
  {
    id: '2',
    level: 2,
    title: 'Red Heading',
    goal: 'Make the heading red using CSS (color: red).',
    hint: 'In style.css add: h1 { color: red; }',
    check: (doc) => {
      const h1 = doc.querySelector('h1')
      if (!h1) return false
      const color = doc.defaultView?.getComputedStyle(h1).color
      return color === 'rgb(255, 0, 0)' || color === 'red'
    }
  },
  {
    id: '3',
    level: 3,
    title: 'Add a Paragraph',
    goal: 'Add a <p> paragraph with any text. Give it a larger font-size in CSS.',
    hint: 'HTML: <p>Your text</p>. CSS: p { font-size: 1.2rem; }',
    check: (doc) => {
      const p = doc.querySelector('p')
      if (!p || !p.textContent?.trim()) return false
      const fontSize = doc.defaultView?.getComputedStyle(p).fontSize
      return fontSize !== '16px' && fontSize !== undefined
    }
  },
  {
    id: '4',
    level: 4,
    title: 'Center with Flexbox',
    goal: 'Center the content on the page using Flexbox (display: flex, justify-content, align-items).',
    hint: 'body { display: flex; justify-content: center; align-items: center; min-height: 100vh; }',
    check: (doc) => {
      const body = doc.body
      const style = doc.defaultView?.getComputedStyle(body)
      return style?.display === 'flex' && (style?.justifyContent === 'center' || style?.alignItems === 'center')
    }
  },
  {
    id: '5',
    level: 5,
    title: 'Style a Button',
    goal: 'Add a <button> and style it: background color and border-radius.',
    hint: 'HTML: <button>Click me</button>. CSS: button { background: #6366f1; border-radius: 8px; }',
    check: (doc) => {
      const btn = doc.querySelector('button')
      if (!btn) return false
      const s = doc.defaultView?.getComputedStyle(btn)
      return (s?.backgroundColor !== 'rgba(0, 0, 0, 0)' && s?.backgroundColor !== 'transparent') && (s?.borderRadius !== '0px' || s?.borderTopLeftRadius !== '0px')
    }
  },
  {
    id: '6',
    level: 6,
    title: 'Card with Border',
    goal: 'Create a div that looks like a card: border, padding, and a subtle shadow.',
    hint: '.card { border: 1px solid #ddd; padding: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }',
    check: (doc) => {
      const card = doc.querySelector('.card') || doc.querySelector('[class*="card"]') || Array.from(doc.querySelectorAll('div')).find(d => d.style.borderWidth || doc.defaultView?.getComputedStyle(d).borderWidth !== '0px')
      if (!card) return false
      const s = doc.defaultView?.getComputedStyle(card)
      return (s?.padding !== '0px' || s?.paddingTop !== '0px') && (s?.boxShadow !== 'none' || s?.borderWidth !== '0px')
    }
  },
  {
    id: '7',
    level: 7,
    title: 'Two-Column Grid',
    goal: 'Use CSS Grid to make a 2-column layout (grid-template-columns).',
    hint: 'container { display: grid; grid-template-columns: 1fr 1fr; }',
    check: (doc) => {
      const grid = Array.from(doc.querySelectorAll('*')).find(el => {
        const s = doc.defaultView?.getComputedStyle(el)
        return s?.display === 'grid' && (s?.gridTemplateColumns?.includes('1fr') || s?.gridTemplateColumns?.includes('fr'))
      })
      return !!grid
    }
  },
  {
    id: '8',
    level: 8,
    title: 'Responsive Text',
    goal: 'Use a responsive font size (e.g. clamp or rem) so text scales.',
    hint: 'body { font-size: clamp(1rem, 2vw, 1.5rem); }',
    check: (doc) => {
      const body = doc.body
      const s = doc.defaultView?.getComputedStyle(body)
      return s?.fontSize !== '16px' || !!doc.documentElement.outerHTML.includes('clamp')
    }
  },
  {
    id: '9',
    level: 9,
    title: 'Gradient Background',
    goal: 'Give the body or a section a gradient background (linear-gradient).',
    hint: 'body { background: linear-gradient(135deg, #6366f1, #8b5cf6); }',
    check: (doc) => {
      const html = doc.documentElement.outerHTML
      return html.includes('linear-gradient') || html.includes('gradient')
    }
  },
  {
    id: '10',
    level: 10,
    title: 'Champion',
    goal: 'You completed all challenges! Add something creative: your name and a cool style.',
    hint: 'You decide!',
    check: () => true
  }
]

const STORAGE_KEY = 'codesphere-challenge-level'

export function getStoredChallengeLevel(): number {
  const v = localStorage.getItem(STORAGE_KEY)
  const n = v ? parseInt(v, 10) : 1
  return Math.max(1, Math.min(n, CHALLENGE_LEVELS.length))
}

export function setStoredChallengeLevel(level: number) {
  localStorage.setItem(STORAGE_KEY, String(Math.max(1, Math.min(level, CHALLENGE_LEVELS.length))))
}
