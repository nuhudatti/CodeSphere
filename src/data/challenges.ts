export interface Challenge {
  id: number
  level: number
  title: string
  goal: string
  hint?: string
  html: string
  css: string
}

export const CHALLENGES: Challenge[] = [
  {
    id: 1,
    level: 1,
    title: 'Your First Page',
    goal: 'Add a heading that says "Hello World" inside the body.',
    hint: 'Use <h1>Hello World</h1>',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Level 1</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>

</body>
</html>`,
    css: `body {\n  font-family: system-ui, sans-serif;\n}`
  },
  {
    id: 2,
    level: 2,
    title: 'Style the Heading',
    goal: 'Make the heading blue and center it on the page.',
    hint: 'Use color and text-align in CSS. Select h1 { }',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Level 2</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Hello World</h1>
</body>
</html>`,
    css: `body {
  font-family: system-ui, sans-serif;
}

h1 {
  /* Make me blue and centered! */
}`
  },
  {
    id: 3,
    level: 3,
    title: 'Add a Button',
    goal: 'Add a button that says "Click me" and style it with a purple background and white text.',
    hint: 'HTML: <button>Click me</button> — CSS: background-color, color, padding',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Level 3</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Hello World</h1>

</body>
</html>`,
    css: `body {
  font-family: system-ui, sans-serif;
}

h1 {
  color: #6366f1;
  text-align: center;
}

/* Style your button here */
button {

}`
  },
  {
    id: 4,
    level: 4,
    title: 'Center with Flexbox',
    goal: 'Use Flexbox to center the heading and button in the middle of the page (both vertically and horizontally).',
    hint: 'On body use display: flex; justify-content: center; align-items: center; flex-direction: column; and min-height: 100vh;',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Level 4</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <h1>Hello World</h1>
  <button>Click me</button>
</body>
</html>`,
    css: `body {
  font-family: system-ui, sans-serif;
}

h1 {
  color: #6366f1;
  text-align: center;
}

button {
  background: #8b5cf6;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
}

/* Use Flexbox on body to center everything */
body {

}`
  },
  {
    id: 5,
    level: 5,
    title: 'Build a Card',
    goal: 'Create a card: a div with a title, short text, and a link. Style it with a border, padding, and rounded corners.',
    hint: 'Wrap content in <div class="card">. Style .card with border, border-radius, padding, max-width.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Level 5</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="card">
    <h2>Card Title</h2>
    <p>This is a short description inside the card.</p>
    <a href="#">Learn more</a>
  </div>
</body>
</html>`,
    css: `body {
  font-family: system-ui, sans-serif;
  padding: 2rem;
}

.card {
  /* Add border, padding, border-radius, max-width */
}`
  },
  {
    id: 6,
    level: 6,
    title: 'Colorful Grid',
    goal: 'Make a 2x2 grid of colored boxes using CSS Grid. Each box can be a div with a different background color.',
    hint: 'Use display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; on the container.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Level 6</title>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
  <div class="grid">
    <div class="box">1</div>
    <div class="box">2</div>
    <div class="box">3</div>
    <div class="box">4</div>
  </div>
</body>
</html>`,
    css: `body {
  font-family: system-ui, sans-serif;
  padding: 2rem;
}

.grid {
  /* Use CSS Grid: 2 columns, gap */
}

.box {
  padding: 2rem;
  text-align: center;
  font-weight: bold;
  /* Give each box a different color - you can use classes like .box:nth-child(1) { background: red; } */
}`
  }
]

export function getChallenge(level: number): Challenge | undefined {
  return CHALLENGES.find(c => c.level === level)
}

export function getNextLevel(current: number): number | null {
  const next = CHALLENGES.find(c => c.level === current + 1)
  return next ? next.level : null
}
