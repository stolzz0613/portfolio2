import React from 'react'
import { StaticImage } from 'gatsby-plugin-image'

import '../../styles/c-technologies.scss'

const componentName = 'c-technologies'

export default function Technologies({stack = [], styles={} }) {
  return (
    <div className={`${componentName}`} style={{...styles}}>
      {stack.includes('react') && (
        <StaticImage
          src="../../../static/images/react.png"
          placeholder="blurred"
          height={35}
          alt="react"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('nextjs') && (
        <StaticImage
          src="../../../static/images/nextjs.png"
          placeholder="blurred"
          height={35}
          alt="nextjs"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('node') && (
        <StaticImage
          src="../../../static/images/node.png"
          placeholder="blurred"
          height={35}
          alt="node"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('salesforce') && (
        <StaticImage
          src="../../../static/images/salesforce.png"
          placeholder="blurred"
          height={35}
          alt="salesforce"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('javascript') && (
        <StaticImage
          src="../../../static/images/javascript.png"
          placeholder="blurred"
          height={35}
          alt="salesforce"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('native') && (
        <StaticImage
          src="../../../static/images/native.png"
          placeholder="blurred"
          height={35}
          alt="salesforce"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
    </div>
  )
}
