import React from 'react'

// A disclosure built on native <details>/<summary>: no JS, accessible, and its
// content stays in the DOM when closed (so the prerendered static HTML remains
// parseable). `print` ("hide" | "open") is exposed as a data attribute the print
// stylesheet targets.
export function Collapsible ({ summary, print, children }) {
  return (
    <details className='collapsible' data-print={print || 'hide'}>
      <summary className='collapsible-summary'>{summary}</summary>
      <div className='collapsible-body'>{children}</div>
    </details>
  )
}
