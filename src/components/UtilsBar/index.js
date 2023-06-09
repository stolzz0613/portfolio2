import React from 'react'
import { StaticImage } from 'gatsby-plugin-image'

import '../../styles/c-utilsbar.scss'

const componentName = 'c-utilsbar'

export default function UtilsBar() {
  return (
    <div className={`${componentName}`}>
      <a
        href="https://github.com/stolzz0613"
        target="_blank"
        title="github link"
      >
        <StaticImage
          src="../../../static/images/git.png"
          placeholder="blurred"
          width={25}
          alt="log github"
          title="log github"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      </a>
      <a href="mailto: andres0613@utp.edu.co" target="_blank" title="mail link">
        <StaticImage
          src="../../../static/images/mail.png"
          placeholder="blurred"
          width={25}
          alt="mail icon"
          title="mail icon"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      </a>
      <a
        href="https://www.linkedin.com/in/andres613/"
        target="_blank"
        title="linkedin link"
      >
        <StaticImage
          src="../../../static/images/linkedin.png"
          placeholder="blurred"
          width={25}
          alt="logo linkeding"
          title="logo linkeding"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      </a>
      <a download={'download cv'} href="/CV.pdf" title="download cv">
        <StaticImage
          src="../../../static/images/cv.png"
          placeholder="blurred"
          width={25}
          alt="cv icon"
          title="cv icon"
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          className={`${componentName}-logo`}
        />
      </a>
    </div>
  )
}
