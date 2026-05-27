import React from 'react'

// A section with a lowercase mono heading sitting on a hairline rule.
export function Section ({ title, className, children }) {
  return (
    <section className={'section' + (className ? ' ' + className : '')}>
      <h2 className='section-head'>{title}</h2>
      {children}
    </section>
  )
}
