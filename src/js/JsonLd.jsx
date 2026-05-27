import React from 'react'

// schema.org/Person structured data, built from the resume content so bots and
// ATS get a clean machine-readable summary. Rendered into the DOM (and baked into
// the static HTML by the prerender step).
export function JsonLd ({ content }) {
  const p = content.PROFILE
  const current = content.WORK.find(w => w.end_date === 'now')

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: p.name,
    email: 'mailto:' + p.email,
    telephone: p.number,
    url: p.link,
    sameAs: [p.linkedin, p.git].filter(Boolean),
    description: p.profile.trim(),
    knowsAbout: content.SKILLS.map(s => s.name),
    alumniOf: content.EDUCATION.map(e => ({ '@type': 'EducationalOrganization', name: e.title }))
  }
  if (current) {
    data.jobTitle = current.job_title
    data.worksFor = { '@type': 'Organization', name: current.title }
    data.hasOccupation = { '@type': 'Occupation', name: current.job_title }
  }

  return (
    <script type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  )
}
