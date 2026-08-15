const assert = require('node:assert/strict')
const fs = require('fs')
const path = require('path')
const test = require('node:test')

const {
  jobGeometry,
  orderedJobs,
  renderCard
} = require('./buildCard.js')

const template = fs.readFileSync(path.join(__dirname, 'card.template.svg'), 'utf8')

test('orders every job by recency without dropping skippable entries', () => {
  const jobs = orderedJobs([
    { title: 'Old', end_date: '2018', skippable: true },
    { title: 'Current', end_date: 'now' },
    { title: 'Middle', end_date: 'May 2022' }
  ])

  assert.deepEqual(jobs.map(job => job.title), ['Current', 'Middle', 'Old'])
})

test('escapes company names and emits them as SVG text', () => {
  const output = renderCard(template, {
    WORK: [{ title: 'A&B <Tools>', end_date: 'now' }]
  })

  assert.match(output, /<text class="resume-job"[^>]*>A&amp;B &lt;Tools&gt;<\/text>/)
  assert.match(output, /A&amp;B &lt;Tools&gt;—scrolling/)
})

test('computes bounds that enter below and leave above the frame', () => {
  const geometry = jobGeometry(8)
  const lastBaseline = geometry.rowStep * 7

  assert.ok(geometry.scrollStart - geometry.jobSize >= 1000)
  assert.ok(geometry.scrollEnd + lastBaseline + geometry.jobSize <= 0)
  assert.ok(geometry.scrollRest > 0)
})

test('renders a deterministic, portable golden-ratio card', () => {
  const content = {
    WORK: [
      { title: 'Meta', end_date: 'now' },
      { title: 'Amazon', end_date: '2023' }
    ]
  }
  const first = renderCard(template, content)
  const second = renderCard(template, content)

  assert.equal(first, second)
  assert.match(first, /viewBox="0 0 1618 1000"/)
  assert.match(first, /<title id="resume-card-title">resume<\/title>/)
  assert.doesNotMatch(first, /<script|foreignObject|\son[a-z]+\s*=/i)
  assert.doesNotMatch(first, /(?:href|src)\s*=\s*["']https?:|url\(\s*["']?https?:|@import/i)
})

test('adding a new current job updates the text and scroll distance', () => {
  const previous = renderCard(template, {
    WORK: [{ title: 'Previous', end_date: '2025' }]
  })
  const updated = renderCard(template, {
    WORK: [
      { title: 'New', end_date: 'now' },
      { title: 'Previous', end_date: '2025' }
    ]
  })

  assert.doesNotMatch(previous, />New<\/text>/)
  assert.match(updated, />New<\/text>/)
  assert.notEqual(
    previous.match(/--resume-scroll-end: ([^;]+)/)[1],
    updated.match(/--resume-scroll-end: ([^;]+)/)[1]
  )
})
