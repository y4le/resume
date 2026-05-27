// Pull a 4-digit year out of values like "2019", "May 2017", "Sep 2011".
export function year (s) {
  const m = String(s).match(/\d{4}/)
  return m ? parseInt(m[0], 10) : null
}

// Stable DOM id for a résumé entry, shared by the rendered <article> and the
// timeline entry that scrolls to it.
export function entryId (e) {
  return 'x-' + String(e.title + '-' + (e.end_date || ''))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
