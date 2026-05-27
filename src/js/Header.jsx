import React from 'react'
import { ThemeToggle } from './ThemeToggle.jsx'

function telHref (number) {
  return 'tel:+' + String(number).replace(/[^\d]/g, '')
}

export function Header ({ profile, pdfHref }) {
  // Place the accent square between the first and last name ("Yale▪Thomas").
  // aria-label keeps the spoken/structured name intact for assistive tech.
  const sp = profile.name.indexOf(' ')
  const first = sp === -1 ? profile.name : profile.name.slice(0, sp)
  const rest = sp === -1 ? '' : profile.name.slice(sp + 1)
  return (
    <header className='head'>
      <h1 className='name' aria-label={profile.name}>{first}<span className='dot' aria-hidden='true' />{rest}</h1>
      <div className='contact'>
        <span className='contact-group'>
          <a href={telHref(profile.number)}>{profile.number}</a>
          <a href={'mailto:' + profile.email}>{profile.email}</a>
        </span>
        <span className='contact-group'>
          <a href={profile.linkedin} target='_blank' rel='me noopener'>linkedin</a>
          <a href={profile.git} target='_blank' rel='me noopener'>github</a>
        </span>
      </div>
      <div className='head-actions'>
        <ThemeToggle />
        <a className='action-btn' href={pdfHref} target='_blank' rel='noopener'>↓ pdf</a>
      </div>
    </header>
  )
}
