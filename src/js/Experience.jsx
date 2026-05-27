import React from 'react'
import { notesToList } from './notes.jsx'
import { EntryDetails } from './EntryDetails.jsx'

function formatDates (entry) {
  const s = entry.start_date
  const e = entry.end_date
  if (s && e) return s + ' — ' + e
  return e || s || ''
}

// One work / education / project entry. `linkTitle` turns the title into a link
// when the entry has a `title_link` (used for projects).
export function Experience ({ entry, linkTitle, id, data }) {
  const isCurrent = entry.end_date === 'now'
  const title = (linkTitle && entry.title_link)
    ? <a href={entry.title_link} target='_blank' rel='noopener noreferrer'>{entry.title}</a>
    : entry.title

  return (
    <article id={id} tabIndex={-1} className={'job' + (entry.skippable ? ' skippable' : '')}>
      <header className='job-head'>
        <h3 className='job-title'>
          {title}
          {entry.job_title ? <span className='role'> — {entry.job_title}</span> : null}
        </h3>
        <span className={'job-date' + (isCurrent ? ' current' : '')}>{formatDates(entry)}</span>
        {entry.skills && entry.skills.length ? (
          <p className='job-tags'>
            {entry.skills.map((s, i) => (
              <span key={s + i}>{i > 0 ? <span className='sep'>·</span> : null}{s}</span>
            ))}
          </p>
        ) : null}
      </header>
      {notesToList(entry.notes)}
      <EntryDetails details={entry.details} data={data} />
    </article>
  )
}
