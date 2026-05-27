import React from 'react'

// Three pips: 3 = primary, 2 = working, 1 = familiar.
export function pips (n) {
  return (
    <span className='skill-rate'>
      {[0, 1, 2].map(i => <span key={i} className={'pip' + (i < n ? ' on' : '')} />)}
    </span>
  )
}

// Maps the 0–1 self-rating to a pip count (same thresholds as the old SkillList).
function pipCount (skill) {
  if (skill <= 0.3) return 1
  if (skill <= 0.6) return 2
  return 3
}

export function Skills ({ skills }) {
  const sorted = [...skills].sort((a, b) => b.skill - a.skill)
  // print uses a single inline keyword line (compact + ATS-friendly), respecting skip
  const printNames = sorted.filter(s => !s.skippable).map(s => s.name).join(', ')
  return (
    <div className='skills'>
      <div className='skills-list'>
        {sorted.map(s => (
          <div className={'skill-row' + (s.skippable ? ' skippable' : '')} key={s.name}>
            <span>{s.name}</span>
            {pips(pipCount(s.skill))}
          </div>
        ))}
      </div>
      <p className='skills-inline'>{printNames}</p>
    </div>
  )
}
