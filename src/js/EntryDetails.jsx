import React from 'react'
import { Collapsible } from './Collapsible.jsx'
import { Classes } from './Classes.jsx'

// Renders an entry's optional `details` — an array of typed, collapsible blocks.
// Each block is dispatched by `kind` through this small registry; unknown kinds
// render nothing rather than breaking the page. `kind: classes` references a
// top-level dataset by name via `source` (e.g. CLASSES) instead of embedding it.
const renderers = {
  classes: (block, data) => {
    const list = data && block.source ? data[block.source] : null
    return Array.isArray(list) ? <Classes classes={list} /> : null
  },
  list: (block) => Array.isArray(block.items)
    ? <ul className='detail-list'>{block.items.map((it, i) => <li key={i}>{it}</li>)}</ul>
    : null,
  text: (block) => block.text ? <p className='detail-text'>{block.text}</p> : null
}

export function EntryDetails ({ details, data }) {
  if (!Array.isArray(details) || !details.length) return null
  return (
    <div className='entry-details'>
      {details.map((block, i) => {
        const render = renderers[block.kind]
        const body = render ? render(block, data) : null
        if (!body) return null
        return (
          <Collapsible key={i} summary={block.summary} print={block.print}>
            {body}
          </Collapsible>
        )
      })}
    </div>
  )
}
