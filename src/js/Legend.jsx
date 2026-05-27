import React from 'react'
import { pips } from './Skills.jsx'

export function Legend () {
  return (
    <div className='legend'>
      <div className='legend-row'>{pips(3)} primary</div>
      <div className='legend-row'>{pips(2)} working</div>
      <div className='legend-row'>{pips(1)} familiar</div>
    </div>
  )
}
