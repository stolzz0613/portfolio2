import React from 'react'
import { StaticImage } from 'gatsby-plugin-image'

const componentName = 'c-companies'

export const getLogo = (name) => {
  return logos()[name]
}

export const logos = () => ({
  globant: (
    <StaticImage
      src="../../../static/images/globant.png"
      placeholder="blurred"
      height={50}
      alt="globant"
      transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
      className={`${componentName}-logo_globant`}
    />
  ),
  epam: (
    <StaticImage
      src="../../../static/images/epam.png"
      placeholder="blurred"
      height={50}
      alt="epam"
      transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
      className={`${componentName}-logo_epam`}
    />
  ),
  grability: (
    <StaticImage
      src="../../../static/images/grability.png"
      placeholder="blurred"
      height={50}
      alt="grability"
      transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
      className={`${componentName}-logo_grability`}
    />
  ),
  pearls: (
    <StaticImage
      src="../../../static/images/10Pearls.png"
      placeholder="blurred"
      height={50}
      alt="10Pearls"
      transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
      className={`${componentName}-logo_10Pearls`}
    />
  ),
})
