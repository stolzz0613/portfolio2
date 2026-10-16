import React from 'react'
import { Link } from 'gatsby'

import '../styles/p-legal.scss'

const componentName = 'p-legal'
const CONTACT = 'andres0613@utp.edu.co'
const UPDATED = 'October 16, 2026'

const PrivacyPage = () => (
  <main className={`${componentName}`}>
    <Link className={`${componentName}-back`} to='/'>← andresb.dev</Link>

    <article lang='en'>
      <h1>Privacy Policy</h1>
      <p className={`${componentName}-meta`}>Crónica del Aventurero · andresb.dev · Last updated: {UPDATED}</p>

      <p>
        This policy explains how <strong>Crónica del Aventurero</strong>, a personal project by Andrés Bustos
        published at <a href='https://www.andresb.dev/proyectos/cronica-del-aventurero/'>andresb.dev/proyectos/cronica-del-aventurero</a>,
        accesses, uses, stores and shares data from Google APIs. It turns daily health and fitness numbers
        into a 16-bit RPG: levels, stats, weekly goals and advice.
      </p>

      <h2>Who uses the app</h2>
      <p>
        The app is used by a single person: its author, Andrés Bustos. It only connects to the author's own
        Google account. It does not offer sign-in to other people and does not access anyone else's data.
        Visitors of andresb.dev don't sign in and no data is collected from them.
      </p>

      <h2>Data accessed from Google</h2>
      <p>With the author's consent, the app reads the following data through the Google Health API (read-only scopes):</p>
      <ul>
        <li><strong>Activity and fitness</strong> (<code>googlehealth.activity_and_fitness.readonly</code>): daily step count and daily active minutes (moderate and vigorous).</li>
        <li><strong>Sleep</strong> (<code>googlehealth.sleep.readonly</code>): minutes asleep per day.</li>
        <li><strong>Health metrics and measurements</strong> (<code>googlehealth.health_metrics_and_measurements.readonly</code>): daily resting heart rate.</li>
      </ul>
      <p>The app never writes, modifies or deletes any data in the Google account.</p>

      <h2>How the data is used</h2>
      <p>
        Once a day, a script reduces the data above to one summary per day (date, steps, minutes asleep, active
        minutes, resting heart rate). Those summaries are used only to show the author's progress in the game:
        character level and stats, weekly goals, boss battles, comparison charts and an estimated "physiological
        age". The data is not used for advertising, profiling, selling, credit or insurance decisions, or for
        training AI models.
      </p>

      <h2>How the data is stored and published</h2>
      <ul>
        <li>The daily summaries are stored in a JSON file in the GitHub repository that hosts andresb.dev and are published on the website <strong>by the author's own choice</strong>, as part of his portfolio. They are visible to anyone who opens the project page.</li>
        <li>The OAuth credentials (client secret and refresh token) are kept as encrypted GitHub Actions secrets and on the author's computer. They are never published.</li>
        <li>No raw data streams, locations, or data other than the daily summaries listed above are stored.</li>
      </ul>

      <h2>Sharing with third parties</h2>
      <ul>
        <li><strong>Anthropic (Claude API):</strong> once a day, the current week's daily summaries are sent to the Claude API to write three short, non-medical recommendations shown in the game ("the Sage"). Anthropic processes them only to generate that response.</li>
        <li><strong>GitHub:</strong> hosts the repository, runs the daily update (GitHub Actions) and serves the website (GitHub Pages).</li>
      </ul>
      <p>Data from Google APIs is not sold and is not shared with anyone else.</p>

      <h2>Limited Use</h2>
      <p>
        The use and transfer of information received from Google APIs adheres to
        the <a href='https://developers.google.com/terms/api-services-user-data-policy' target='_blank' rel='noopener noreferrer'>Google API Services User Data Policy</a>,
        including the Limited Use requirements.
      </p>

      <h2>Retention and deletion</h2>
      <p>
        The daily summaries are kept while the project is online so the game can show history. The author can
        delete them at any time by removing the data file from the repository and the website. Access can be
        revoked at any time from <a href='https://myaccount.google.com/permissions' target='_blank' rel='noopener noreferrer'>myaccount.google.com/permissions</a>;
        after that, no new data is read.
      </p>

      <h2>Security</h2>
      <p>
        Data is transferred only over HTTPS. The OAuth credentials are stored as encrypted secrets with access
        limited to the repository owner, and the app only requests read-only scopes.
      </p>

      <p>
        Use of the app and of andresb.dev is also covered by the <Link to='/terms/'>Terms of Service</Link>.
      </p>

      <h2>Changes and contact</h2>
      <p>
        If this policy changes, the new version will be published on this page with a new date. For any
        question, write to <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>
    </article>

    <article lang='es' className={`${componentName}-es`}>
      <h2>Resumen en español</h2>
      <p>
        <strong>Crónica del Aventurero</strong> es un proyecto personal de Andrés Bustos. Solo se conecta a su propia
        cuenta de Google y, con permisos de solo lectura de la Google Health API, lee sus pasos, minutos activos,
        minutos de sueño y frecuencia cardiaca en reposo. Con esos resúmenes diarios muestra su progreso en el juego.
        Los resúmenes se publican en andresb.dev por decisión del autor. Cada día, los datos de la semana se envían a la
        API de Claude (Anthropic) para escribir consejos no médicos. GitHub aloja el sitio. Los datos no se venden ni se
        usan para publicidad ni para entrenar modelos de IA, y el uso cumple la Política de Datos de Usuario de los
        Servicios de API de Google, incluidos los requisitos de Uso Limitado. El acceso se puede revocar en
        myaccount.google.com/permissions. Contacto: <a href={`mailto:${CONTACT}`}>{CONTACT}</a>.
      </p>
    </article>
  </main>
)

export default PrivacyPage

export const Head = () => (
  <>
    <title>Privacy Policy · Andres Bustos</title>
    <meta name='description' content='Privacy policy for Crónica del Aventurero: what Google Health data it reads, how it is used, stored and shared.' />
    <link rel='canonical' href='https://www.andresb.dev/privacy/' />
  </>
)
