import React from 'react'
import '../../styles/c-companies.scss'
import { getLogo } from './logos'

const componentName = 'c-companies'

export default function Companies({ handleClick }) {
  return (
    <div className={`${componentName}`}>
      <div onClick={() => handleClick('globant')}>{getLogo('globant')}</div>
      <div onClick={() => handleClick('epam')}>{getLogo('epam')}</div>
      <div onClick={() => handleClick('grability')}>
      {getLogo('grability')}
      </div>
      <div onClick={() => handleClick('pearls')}>{getLogo('pearls')}</div>
    </div>
  )
}
