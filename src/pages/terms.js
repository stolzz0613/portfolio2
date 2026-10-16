import React from 'react'
import { Link } from 'gatsby'

import '../styles/p-legal.scss'

const componentName = 'p-legal'
const CONTACT = 'andres0613@utp.edu.co'
const UPDATED = 'October 16, 2026'

const TermsPage = () => (
  <main className={`${componentName}`}>
    <Link className={`${componentName}-back`} to='/'>← andresb.dev</Link>

    <article lang='en'>
      <h1>Terms of Service</h1>
      <p className={`${componentName}-meta`}>Crónica del Aventurero · andresb.dev · Last updated: {UPDATED}</p>

      <p>
        These terms apply to andresb.dev and to the projects published on it, including <strong>Crónica del
        Aventurero</strong> and the <strong>Guía de Pokémon Platino</strong>, personal projects by Andrés Bustos.
        By using the site you accept these terms.
      </p>

      <h2>What the service is</h2>
      <p>
        andresb.dev is a personal portfolio. Crónica del Aventurero is a personal, non-commercial app that shows
        its author's own health and fitness data, read from his Google account through the Google Health API, as
        a 16-bit RPG. It is offered free of charge and "as is". There are no user accounts: visitors can only view
        the published pages.
      </p>

      <h2>Not medical advice</h2>
      <p>
        Levels, goals, the "physiological age" and the recommendations written by an AI model ("the Sage") are
        motivational estimates for a game. They are <strong>not</strong> medical advice, diagnosis or treatment.
        Always consult a qualified health professional about your health.
      </p>

      <h2>Google data</h2>
      <p>
        The app only accesses the author's own Google account, with read-only permissions, and handles that data
        as described in the <Link to='/privacy/'>Privacy Policy</Link>. Access can be revoked at any time
        from <a href='https://myaccount.google.com/permissions' target='_blank' rel='noopener noreferrer'>myaccount.google.com/permissions</a>.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Don't try to disrupt the site, access it in ways other than through its public pages, or use its content
        to harm or harass anyone. Pokémon names and other trademarks belong to their owners; the Pokémon guide is
        an unofficial fan project. The pixel art in Crónica del Aventurero comes from Kenney's public domain
        (CC0) packs.
      </p>

      <h2>No warranty and limitation of liability</h2>
      <p>
        The site and its projects are provided without warranties of any kind. The data may be incomplete or
        inaccurate, and the site may change or stop being available at any time. To the extent permitted by law,
        the author is not liable for any damage arising from the use of the site.
      </p>

      <h2>Changes and contact</h2>
      <p>
        These terms may change; the new version will be published on this page with a new date. For any
        question, write to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>
    </article>

    <article lang='es' className={`${componentName}-es`}>
      <h2>Resumen en español</h2>
      <p>
        andresb.dev es un portafolio personal y Crónica del Aventurero es una app personal y gratuita que muestra
        como un RPG los datos de salud de su autor, leídos de su propia cuenta de Google con permisos de solo lectura.
        Se ofrece "tal cual", sin garantías. Los niveles, metas, la edad fisiológica y los consejos del Sabio
        (escritos por IA) son estimaciones para un juego y <strong>no son consejo médico</strong>. El manejo de los
        datos de Google se describe en la <Link to='/privacy/'>Política de Privacidad</Link>. Contacto: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>
    </article>
  </main>
)

export default TermsPage

export const Head = () => (
  <>
    <title>Terms of Service · Andres Bustos</title>
    <meta name='description' content='Terms of service for andresb.dev and Crónica del Aventurero.' />
    <link rel='canonical' href='https://www.andresb.dev/terms/' />
  </>
)
