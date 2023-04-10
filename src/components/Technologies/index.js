import React from 'react'
import '../../styles/c-technologies.scss'
import { StaticImage } from 'gatsby-plugin-image'

const componentName = 'c-technologies'

export default function Technologies({stack = [], styles={} }) {
  return (
    <div className={`${componentName}`} style={{...styles}}>
      {stack.includes('react') && (
        <StaticImage
          src="../../images/react.png"
          placeholder="blurred"
          height={35}
          alt="react"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('nextjs') && (
        <StaticImage
          src="../../images/nextjs.png"
          placeholder="blurred"
          height={35}
          alt="nextjs"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('node') && (
        <StaticImage
          src="../../images/node.png"
          placeholder="blurred"
          height={35}
          alt="node"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('salesforce') && (
        <StaticImage
          src="../../images/salesforce.png"
          placeholder="blurred"
          height={35}
          alt="salesforce"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('javascript') && (
        <StaticImage
          src="../../images/javascript.png"
          placeholder="blurred"
          height={35}
          alt="salesforce"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('native') && (
        <StaticImage
          src="../../images/native.png"
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
