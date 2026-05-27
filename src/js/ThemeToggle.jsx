import React from 'react'
import { useState, useEffect } from 'react'

function readTheme () {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
}

// Flips data-theme on <html> and remembers the choice. The no-flash bootstrap in
// index.html sets the initial value before paint.
export function ThemeToggle () {
  const [theme, setTheme] = useState(readTheme())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('theme', theme) } catch (e) { /* storage may be blocked */ }
  }, [theme])

  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button
      className='action-btn'
      type='button'
      onClick={() => setTheme(next)}
      aria-label={'switch to ' + next + ' theme'}
    >
      {'→ ' + next}
    </button>
  )
}
