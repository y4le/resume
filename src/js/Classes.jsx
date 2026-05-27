import React from 'react'

// Dense mono reference table, sorted by semester → subject → number.
// Hidden in print (it's low-signal for a one-page PDF).
export function Classes ({ classes }) {
  const sorted = [...classes].sort((a, b) => {
    if (a.semester !== b.semester) return a.semester - b.semester
    if (a.subject !== b.subject) return a.subject < b.subject ? -1 : 1
    return a.number - b.number
  })
  return (
    <div className='classes-grid'>
      {sorted.map(c => (
        <div className='class-row' key={c.subject + c.number}>
          <span className='class-code'>{c.subject} {c.number}</span>
          <span className='class-name'>{c.name}</span>
        </div>
      ))}
    </div>
  )
}
