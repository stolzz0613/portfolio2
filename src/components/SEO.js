import React from 'react'

const TITLE = 'Andrés Bustos · Senior Full Stack Engineer'
const DESCRIPTION = 'Senior Full Stack Software Engineer and Technical Lead with 8+ years building enterprise web, mobile, e-commerce and AI products with React, Node.js, Salesforce Commerce Cloud and the cloud.'
const URL = 'https://www.andresb.dev/'

export default function SEO() {
  return (
    <>
      <html lang='en' />
      <title>{TITLE}</title>
      <meta name='description' content={DESCRIPTION} />
      <meta name='keywords' content='Full Stack, Senior Software Engineer, Technical Lead, React, Next.js, Node.js, Salesforce Commerce Cloud, AI' />
      <meta name='author' content='Andrés Julián Bustos' />
      <meta name='theme-color' content='#050506' />
      <link rel='canonical' href={URL} />
      <meta property='og:type' content='website' />
      <meta property='og:url' content={URL} />
      <meta property='og:title' content={TITLE} />
      <meta property='og:description' content={DESCRIPTION} />
      <meta property='og:image' content={`${URL}images/image.png`} />
      <meta name='twitter:card' content='summary_large_image' />
    </>
  )
}
