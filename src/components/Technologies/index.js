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
          alt="logo react"
          title="logo react"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('nextjs') && (
        <StaticImage
          src="../../../static/images/nextjs.png"
          placeholder="blurred"
          height={35}
          alt="logo nextjs"
          title="logo nextjs"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('node') && (
        <StaticImage
          src="../../../static/images/node.png"
          placeholder="blurred"
          height={35}
          alt="logo node"
          title="logo node"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('salesforce') && (
        <StaticImage
          src="../../../static/images/salesforce.png"
          placeholder="blurred"
          height={35}
          alt="logo salesforce"
          title="logo salesforce"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('javascript') && (
        <StaticImage
          src="../../../static/images/javascript.png"
          placeholder="blurred"
          height={35}
          alt="logo javascript"
          title="logo javascript"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
      {stack.includes('native') && (
        <StaticImage
          src="../../../static/images/native.png"
          placeholder="blurred"
          height={35}
          alt="logo react native"
          title="logo react native"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      )}
    </div>
  )
}
