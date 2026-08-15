import React from 'react'
import { ThemeToggle } from './ThemeToggle.jsx'

const PUBLISHER_HOME = 'https://yalethom.as/'
const PUBLISHER_LABEL = 'YaleThom.as/resume'

function telHref (number) {
  return 'tel:+' + String(number).replace(/[^\d]/g, '')
}

function SiteLabel ({ label }) {
  const period = label.indexOf('.')
  if (period === -1) return label

  return <>{label.slice(0, period)}<span className='brand-highlight'>.</span>{label.slice(period + 1)}</>
}

export function Header ({ profile, pdfHref }) {
  return (
    <header className='head'>
      <h1 className='name'>
        <a
          className='publisher-signature'
          href={PUBLISHER_HOME}
          aria-label={PUBLISHER_LABEL + ', publisher home'}
        >
          <SiteLabel label={PUBLISHER_LABEL} />
        </a>
      </h1>
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
