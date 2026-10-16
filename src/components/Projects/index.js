import React from 'react'

import '../../styles/c-projects.scss'

const componentName = 'c-projects'

const projects = [
  {
    slug: 'cronica-del-aventurero',
    title: 'Crónica del Aventurero',
    description: 'Fitness tracker disguised as a 16-bit RPG. Steps, sleep and activity become XP, levels, stats and weekly boss fights, with adaptive goals and a story written from your own data.',
    tags: ['javascript', 'canvas', 'pixel art', 'data viz'],
  },
  {
    slug: 'guia-pokemon-platino',
    title: 'Guía de Pokémon Platino',
    description: 'Interactive walkthrough of Pokémon Platinum: every chapter of the story with checklists for Pokémon, items and battles, chapter maps, a full Sinnoh Pokédex and progress saved automatically.',
    tags: ['javascript', 'svg maps', 'search & filters', 'local storage'],
  },
]

export default function Projects() {
  return (
    <section className={`${componentName}`} id='projects' aria-labelledby='projects-title'>
      <h2 id='projects-title' className={`${componentName}-title`}>Projects</h2>
      <div className={`${componentName}-grid`}>
        {projects.map(({ slug, title, description, tags }) => (
          <a key={slug} className={`${componentName}-card`} href={`/proyectos/${slug}/`}>
            <img
              className={`${componentName}-card_preview`}
              src={`/proyectos/${slug}/preview.png`}
              alt={`Preview of ${title}`}
              width={1280}
              height={800}
              loading='lazy'
            />
            <div className={`${componentName}-card_body`}>
              <h3>{title}</h3>
              <p>{description}</p>
              <ul className={`${componentName}-card_tags`}>
                {tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
              <span className={`${componentName}-card_cta`}>View project →</span>
            </div>
          </a>
        ))}
      </div>
      <p className={`${componentName}-legal`}>
        <a href='/privacy/'>Privacy policy</a> · <a href='/terms/'>Terms of service</a>
      </p>
    </section>
  )
}
