import React from 'react'

export default function SEO() {
  const description = "Passionate developer with +5 years of experience. Committed to delivering clean, responsive, and accessible websites optimized for performance and usability. Dedicated to providing the best possible user experience.";
  const keywords = "FullStack, developer, React, FrontEntd, UI/UX"

  return (
    <>
        <title>Andres Bustos FullStack developer with 5 years of experience</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <link rel="canonical" href="https://andresb.dev" />
        <meta name="author" content="Andres Bustos"></meta>
        <meta name="publisher" content="Andres Bustos C" />
    </>
  )
}
