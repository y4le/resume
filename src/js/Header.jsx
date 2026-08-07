import React from 'react'
import { ThemeToggle } from './ThemeToggle.jsx'

function telHref (number) {
  return 'tel:+' + String(number).replace(/[^\d]/g, '')
}

function siteLabel (url) {
  return String(url).replace(/^https?:\/\//, '').replace(/\/$/, '')
}

function SiteLabel ({ url }) {
  const label = siteLabel(url)
  const period = label.indexOf('.')
  if (period === -1) return label

  return <>{label.slice(0, period)}<span className='brand-highlight'>.</span>{label.slice(period + 1)}</>
}

export function Header ({ profile, pdfHref }) {
  return (
    <header className='head'>
      <h1 className='name' aria-label={profile.name}><SiteLabel url={profile.link} /></h1>
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
