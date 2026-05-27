import React from 'react'

// Notes are newline-separated lines, each becoming a bullet. A line may carry a
// single inline markdown link: [text](https://…). A line ending in `[skip]` is
// marked skippable — shown on screen (full resume) but hidden in the compact PDF,
// mirroring the entry-level `skippable` flag.
const LINK_RE = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/
const SKIP_RE = /\s*\[skip\]\s*$/i

export function notesToList (notes) {
  if (!notes) return null
  const items = notes.split('\n').filter(n => n.trim() !== '')
  if (!items.length) return null
  return (
    <ul>
      {items.map((raw, i) => {
        const skip = SKIP_RE.test(raw)
        const note = raw.replace(SKIP_RE, '')
        const cls = skip ? 'skippable' : undefined
        const m = note.match(LINK_RE)
        if (m) {
          return (
            <li key={i} className={cls}>
              {note.substring(0, m.index)}
              <a href={m[2]} target='_blank' rel='noopener noreferrer'>{m[1]}</a>
              {note.substring(m.index + m[0].length)}
            </li>
          )
        }
        return <li key={i} className={cls}>{note}</li>
      })}
    </ul>
  )
}
