import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// Using the Tailwind Play CDN for quick verification; the project also contains
// `src/styles.css` with Tailwind directives but it's not imported here to avoid
// PostCSS plugin issues during local build in this environment.


const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)
