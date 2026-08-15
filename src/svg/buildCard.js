const fs = require('fs')
const path = require('path')

const ROOT = path.resolve(__dirname, '../..')
const TEMPLATE_PATH = path.join(__dirname, 'card.template.svg')
const CONTENT_PATH = path.join(ROOT, 'src/resume-content/dist/data.json')
const OUTPUT_PATH = path.join(ROOT, '.yalethomas/card.svg')

const FRAME_HEIGHT = 1000
const JOB_X = 1480
const MAX_JOB_SIZE = 82
const MAX_ROW_STEP = 112
const STATIC_BASELINE_SPAN = 784

function xmlEscape (value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function endRank (entry) {
  const end = String(entry.end_date || '').toLowerCase()
  if (end === 'now' || end === 'present') return Number.POSITIVE_INFINITY

  const years = end.match(/(?:19|20)\d{2}/g)
  return years ? Number(years[years.length - 1]) : Number.NEGATIVE_INFINITY
}

function orderedJobs (work) {
  if (!Array.isArray(work) || work.length === 0) {
    throw new Error('Resume card requires a nonempty WORK array')
  }

  return work
    .map((entry, index) => {
      if (!entry || typeof entry.title !== 'string' || entry.title.trim() === '') {
        throw new Error(`Resume card WORK entry ${index} requires a nonempty title`)
      }
      return { entry, index }
    })
    .sort((a, b) => endRank(b.entry) - endRank(a.entry) || a.index - b.index)
    .map(({ entry }) => entry)
}

function round (value) {
  return Number(value.toFixed(2))
}

function jobGeometry (count) {
  if (!Number.isInteger(count) || count < 1) {
    throw new Error('Resume card geometry requires at least one job')
  }

  const rowStep = count === 1
    ? 0
    : Math.min(MAX_ROW_STEP, STATIC_BASELINE_SPAN / (count - 1))
  const jobSize = count === 1
    ? MAX_JOB_SIZE
    : Math.min(MAX_JOB_SIZE, rowStep * 0.75)
  const lastBaseline = rowStep * (count - 1)

  return {
    rowStep: round(rowStep),
    jobSize: round(jobSize),
    scrollStart: round(FRAME_HEIGHT + jobSize),
    scrollEnd: round(-(lastBaseline + jobSize)),
    scrollRest: round((FRAME_HEIGHT - lastBaseline) / 2)
  }
}

function replaceToken (source, token, value) {
  const occurrences = source.split(token).length - 1
  if (occurrences !== 1) {
    throw new Error(`Resume card template must contain exactly one ${token} token`)
  }
  return source.replace(token, value)
}

function renderCard (template, content) {
  const jobs = orderedJobs(content && content.WORK)
  const geometry = jobGeometry(jobs.length)
  const companyNames = jobs.map(job => job.title.trim())
  const description = `The muted resume wordmark with Yale Thomas&apos;s work history—${companyNames.map(xmlEscape).join(', ')}—scrolling upward over its right side.`
  const style = [
    `--resume-job-size: ${geometry.jobSize}px`,
    `--resume-scroll-start: ${geometry.scrollStart}px`,
    `--resume-scroll-end: ${geometry.scrollEnd}px`,
    `--resume-scroll-rest: ${geometry.scrollRest}px`
  ].join('; ')
  const text = jobs.map((job, index) => {
    const y = round(index * geometry.rowStep)
    return `      <text class="resume-job" x="${JOB_X}" y="${y}">${xmlEscape(job.title.trim())}</text>`
  }).join('\n')

  let output = template
  output = replaceToken(output, '__RESUME_DESCRIPTION__', description)
  output = replaceToken(output, '__RESUME_JOB_STYLE__', style)
  output = replaceToken(output, '__RESUME_JOB_TEXT__', text)

  if (/__RESUME_[A-Z_]+__/.test(output)) {
    throw new Error('Resume card template contains an unreplaced token')
  }

  return output.endsWith('\n') ? output : output + '\n'
}

function generatedCard () {
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8')
  const content = JSON.parse(fs.readFileSync(CONTENT_PATH, 'utf8'))
  return renderCard(template, content)
}

function main (args = process.argv.slice(2)) {
  const unknown = args.filter(arg => arg !== '--check')
  if (unknown.length) {
    throw new Error(`Unknown resume card argument: ${unknown.join(', ')}`)
  }

  const output = generatedCard()
  if (args.includes('--check')) {
    const current = fs.existsSync(OUTPUT_PATH) ? fs.readFileSync(OUTPUT_PATH, 'utf8') : null
    if (current !== output) {
      console.error('Generated project card is stale; run `yarn card` and commit .yalethomas/card.svg')
      process.exitCode = 1
      return
    }
    console.log('Generated project card is current')
    return
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true })
  fs.writeFileSync(OUTPUT_PATH, output)
  console.log(`Generated ${path.relative(ROOT, OUTPUT_PATH)}`)
}

if (require.main === module) main()

module.exports = {
  endRank,
  jobGeometry,
  orderedJobs,
  renderCard,
  xmlEscape
}
