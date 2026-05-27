import React from 'react'
import { useEffect, useRef, useState } from 'react'

const VIEWBOX_WIDTH = 200
const BASE_TEXT_SIZE = 7
const MAX_TEXT_PX = 14

/*
 * A reusable timeline in the tufte style.
 *
 * props:
 *   entries: [{ id, label, start, end, current?, primary? }]
 *            start/end are numeric years; current marks the ongoing one;
 *            primary entries show in the compact rail view.
 *   now:     number — the right edge of the axis (defaults to the current year).
 *   onSelect(id): called when an entry is clicked (e.g. to scroll the page to it).
 */

// ── compact SVG bar chart (the default rail visual) ───────────────────────────
function Compact ({ rows, minYear, maxYear, onSelect, textSize }) {
  const span = Math.max(1, maxYear - minYear)
  const W = VIEWBOX_WIDTH
  const rowH = 18
  const barH = 6
  const topPad = 4
  const axisH = 16
  const plotH = rows.length * rowH + topPad
  const H = plotH + axisH
  const xFor = y => ((y - minYear) / span) * W

  const ticks = []
  for (let y = minYear; y <= maxYear; y += 2) ticks.push(y)

  return (
    <svg viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio='xMinYMin meet'
      role='img' aria-label='career timeline'>
      {rows.map((r, i) => {
        const x = xFor(r.start)
        const w = Math.max(2, xFor(r.end) - x)
        const y = topPad + i * rowH + 8
        const labelEnd = x > W * 0.55
        return (
          <g key={r.id} className='tl-bar-g'
            onClick={() => onSelect && onSelect(r.id)}
            style={{ cursor: onSelect ? 'pointer' : 'default' }}>
            <title>{r.label}</title>
            <text x={labelEnd ? xFor(r.end) : x} y={y - 3}
              textAnchor={labelEnd ? 'end' : 'start'}
              fontFamily='var(--font-mono)' fontSize={textSize}
              fill={r.current ? 'var(--accent)' : 'var(--fg)'}>{r.label.toLowerCase()}</text>
            <rect x={x} y={y} width={w} height={barH}
              fill={r.current ? 'var(--accent)' : 'var(--muted)'} />
          </g>
        )
      })}
      <line x1='0' y1={plotH} x2={W} y2={plotH} stroke='var(--rule)' strokeWidth='0.5' />
      {ticks.map(t => {
        const x = xFor(t)
        const end = x > W * 0.9
        return (
          <text key={t} x={x} y={H - 2} textAnchor={end ? 'end' : 'start'}
            fontFamily='var(--font-mono)' fontSize={textSize} fill='var(--muted)'
          >{"'" + String(t).slice(2)}</text>
        )
      })}
    </svg>
  )
}

export function Timeline ({ entries, now, onSelect }) {
  const NOW = now || new Date().getFullYear()
  const ref = useRef(null)
  const [width, setWidth] = useState(VIEWBOX_WIDTH)
  const valid = (entries || []).filter(e => e.start != null && e.end != null)

  useEffect(() => {
    if (!ref.current) return undefined
    const update = () => setWidth(ref.current.getBoundingClientRect().width || VIEWBOX_WIDTH)
    update()
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', update)
      return () => window.removeEventListener('resize', update)
    }
    const observer = new ResizeObserver(update)
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  if (!valid.length) return null

  const primary = valid.filter(e => e.primary).sort((a, b) => a.start - b.start)
  const all = [...valid].sort((a, b) => a.start - b.start)
  const collapsedRows = primary.length ? primary : all
  const cMin = Math.min.apply(null, collapsedRows.map(r => r.start))
  const textSize = Math.min(BASE_TEXT_SIZE, (MAX_TEXT_PX * VIEWBOX_WIDTH) / Math.max(1, width))

  const select = id => {
    if (onSelect) onSelect(id)
  }

  return (
    <div className='timeline' ref={ref}>
      <div className='tl-compact'>
        <Compact rows={collapsedRows} minYear={cMin} maxYear={NOW} onSelect={select} textSize={textSize} />
      </div>
    </div>
  )
}
