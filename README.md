# CodeSphere

**Next-generation, mobile-first HTML & CSS live playground.** Code, preview, level up — with level-by-level challenges and instant live preview.

[![CodeSphere](https://img.shields.io/badge/CodeSphere-HTML%20%26%20CSS%20Playground-6366f1?style=for-the-badge)](.)

## Features

- **Mobile-first**: Full-height editor and preview on phone; tab switcher (Files | Editor | Preview); desktop 3-column layout
- **Project challenges**: Level-by-level goals (e.g. “Add a red heading”, “Center with Flexbox”). Build in the editor, see instant preview, hit **Check** to pass and unlock the next level
- **Virtual file system**: Folder tree, add/delete/rename files and folders. Only `.html` and `.css`
- **Live preview**: Updates as you type (300ms debounce); `index.html` + all CSS merged automatically
- **Gamification**: XP, levels, progress ring, achievements (First File, Styled Button, Flexbox, Grid, Saver, etc.)
- **Creative Mode**: Toggle in Settings for a more playful theme
- **PWA**: Offline support, installable on mobile
- **Glassmorphism UI**: Rounded corners, soft shadows, electric blue / purple accent

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`). Use the same network on your phone to test mobile.

## Build

```bash
npm run build
npm run preview
```

Output is in `dist/`.

## Deploy to GitHub Pages

### Option 1: Deploy from `dist/` (manual)

1. Build: `npm run build`
2. Push the contents of `dist/` to a branch named `gh-pages`, or use a tool like [gh-pages](https://www.npmjs.com/package/gh-pages):
   ```bash
   npx gh-pages -d dist
   ```
3. In your repo: **Settings → Pages → Source**: deploy from branch `gh-pages`, folder `/ (root)`.
4. Your site will be at `https://<username>.github.io/<repo-name>/`.

### Option 2: GitHub Actions (automatic)

A workflow is included at `.github/workflows/deploy.yml`. On every push to `main` it builds and deploys to GitHub Pages. Enable Pages as above and set source to **GitHub Actions**.

## Project challenges

Tap the **Challenges** (🎯) button in the header to turn on challenge mode. You’ll see the current level’s goal; use the **Editor** tab to write HTML/CSS and the **Preview** tab to see the result. When it matches the goal, tap **Check** to pass and **Next level** to continue. Progress is saved in the browser.

## PWA icons

For install prompts, add `public/icon-192.png` and `public/icon-512.png`, or change the manifest in `vite.config.ts` to use another asset.

## Stack

- React 18 + TypeScript
- Vite 5
- CodeMirror 6 (@uiw/react-codemirror, @codemirror/lang-html, @codemirror/lang-css)
- vite-plugin-pwa (Workbox)
- localStorage for project, gamification, and challenge progress

## License

MIT
