import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import { SEO } from '../components'
import NetworkBackground from '../components/NetworkBackground'
import { contact, experience, projects, skillGroups, stack, stats, timeline } from '../data/profile'

import '../styles/p-home.scss'

const SECTIONS = [['about', 'About'], ['experience', 'Experience'], ['projects', 'Projects'], ['skills', 'Skills'], ['contact', 'Contact']]

// Engagement timeline, drawn to one scale from the first engagement to the end of this year.
function Timeline() {
  const today = new Date()
  const now = today.getFullYear() + today.getMonth() / 12
  const start = Math.min(...timeline.map((r) => r.from))
  const end = today.getFullYear() + 1
  const pct = (y) => ((y - start) / (end - start)) * 100
  const years = []
  for (let y = Math.ceil(start); y < end; y++) years.push(y)
  return (
    <div className='tl' role='img' aria-label='Timeline of engagements since 2020, with Globant and EPAM Anywhere running in parallel since 2022'>
      <div className='tl-inner'>
        {timeline.map(({ who, from, to, contract, now: ongoing }) => (
          <div className='tl-row' key={who}>
            <span className='who'>{who}</span>
            <div className='tl-track'>
              <span
                className={`tl-bar${contract ? ' contract' : ''}${ongoing ? ' now' : ''}`}
                style={{ left: `${pct(from)}%`, width: `${pct(ongoing ? now : to) - pct(from)}%` }}
              />
            </div>
          </div>
        ))}
        <div className='tl-axis'>
          <span />
          <div className='tl-years'>{years.map((y) => <span key={y} style={{ left: `${pct(y)}%` }}>{y}</span>)}</div>
        </div>
      </div>
      <div className='tl-legend'><span><i />Employer engagement</span><span><i className='c' />Contractor</span></div>
    </div>
  )
}

function CopyEmail() {
  const [label, setLabel] = useState('Copy email')
  const ref = useRef(null)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setLabel('Copied')
    } catch {
      window.getSelection().selectAllChildren(ref.current)
      setLabel('Selected, press Ctrl+C')
    }
  }
  return (
    <div className='mail'>
      <a ref={ref} href={`mailto:${contact.email}`}><code>{contact.email}</code></a>
      <button className='btn primary' type='button' onClick={copy}>{label}</button>
    </div>
  )
}

const IndexPage = () => {
  const [active, setActive] = useState('about')
  const heroRef = useRef(null)

  // The section index follows the scroll.
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      for (const en of entries) if (en.isIntersecting) setActive(en.target.id)
    }, { rootMargin: '-40% 0px -55% 0px' })
    SECTIONS.forEach(([id]) => io.observe(document.getElementById(id)))
    return () => io.disconnect()
  }, [])

  // A slight tilt on the illustration under the cursor.
  const tilt = (e) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = heroRef.current.getBoundingClientRect()
    const dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5
    heroRef.current.style.transform = `perspective(900px) rotateY(${dx * 6}deg) rotateX(${-dy * 6}deg)`
  }

  return (
    <>
      <NetworkBackground />
      <div className='page'>
        <header className='intro'>
          <div className='eyebrow'>Available for senior &amp; lead roles</div>
          <h1>Andrés<span>Bustos</span></h1>
          <p className='role'>Senior Full Stack Engineer · <b>Technical Lead</b></p>
          <p className='lede'>I build enterprise web, mobile, e-commerce and AI products end to end, from React front ends to the middleware and APIs that hold them together.</p>
          <nav aria-label='Sections'>
            <ul className='index'>
              {SECTIONS.map(([id, label]) => (
                <li key={id}><a href={`#${id}`} className={active === id ? 'on' : ''}>{label}</a></li>
              ))}
            </ul>
          </nav>
          <div className='intro-foot'>
            <a className='btn primary' href='#contact'>Let's talk</a>
            <a className='btn' href='/CV.pdf' download='Andres_Julian_Bustos_CV.pdf'>Download CV</a>
            <div className='social'>
              <a href={contact.github} target='_blank' rel='noopener noreferrer' aria-label='GitHub'>
                <svg viewBox='0 0 24 24'><path d='M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z' /></svg>
              </a>
              <a href={contact.linkedin} target='_blank' rel='noopener noreferrer' aria-label='LinkedIn'>
                <svg viewBox='0 0 24 24'><path d='M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2ZM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2Zm1.8 13.1H3.5V9h3.6v11.5ZM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0Z' /></svg>
              </a>
            </div>
          </div>
        </header>

        <main className='work'>
          <section id='about' aria-label='About'>
            <figure className='hero' ref={heroRef} onPointerMove={tilt} onPointerLeave={() => { heroRef.current.style.transform = '' }}>
              <StaticImage
                src='../../static/images/image.png'
                alt='Illustration of Andrés in a red jacket at a workstation surrounded by interface panels'
                placeholder='blurred'
                width={760}
                objectPosition='center 28%'
                loading='eager'
              />
              <div className='stats'>
                {stats.map((s) => (
                  <div className='stat' key={s.label}><b>{s.value}{s.suffix && <em>{s.suffix}</em>}</b><span>{s.label}</span></div>
                ))}
              </div>
            </figure>
            <div className='about'>
              <p>Senior Full Stack Software Engineer and Technical Lead. I work across <strong>React, Next.js, React Native, Node.js, NestJS, Python and C#/.NET</strong>, with deep experience in <strong>Salesforce Commerce Cloud and Marketing Cloud</strong> and cloud platforms on AWS, Azure and Oracle Cloud. I lead through solution design, code reviews and mentoring, and I like the hard middle of a system: headless commerce, microfrontends, middleware and the integrations that move data between teams.</p>
            </div>
          </section>

          <section id='experience' aria-labelledby='exp-h'>
            <h2 className='sec-h' id='exp-h'>Experience</h2>
            <Timeline />
            {experience.map((o) => (
              <div className='org' key={o.org}>
                <div className='org-h'>
                  <h3>{o.org}</h3><p>{o.when}</p>
                  {o.sub && <span className='sub'>{o.sub}</span>}
                </div>
                {o.jobs.map((j) => (
                  <article className='job' key={j.client}>
                    <div className='when'>{j.when}</div>
                    <div>
                      <h4>{j.title} <small>· {j.client}</small></h4>
                      <p>{j.text}</p>
                      {j.tags && <ul className='chips'>{j.tags.map((t) => <li key={t}>{t}</li>)}</ul>}
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </section>

          <section id='projects' aria-labelledby='proj-h'>
            <h2 className='sec-h' id='proj-h'>Projects</h2>
            <div className='projects'>
              {projects.map((p) => (
                <a className='proj' key={p.slug} href={`/proyectos/${p.slug}/`}>
                  <img src={`/proyectos/${p.slug}/preview.png`} alt={`${p.title} screenshot`} width={1280} height={800} loading='lazy' />
                  <div><h3>{p.title}</h3><p>{p.text}</p><span className='go'>View project →</span></div>
                </a>
              ))}
            </div>
          </section>

          <section id='skills' aria-labelledby='skills-h'>
            <h2 className='sec-h' id='skills-h'>Skills</h2>
            <div className='skills'>
              <div className='icons'>
                {stack.map(([file, label, mono]) => (
                  <span className={`icon${mono ? ' mono' : ''}`} key={file}>
                    <img src={`/images/stack/${file}.svg`} alt='' width={30} height={30} loading='lazy' />{label}
                  </span>
                ))}
              </div>
              <div className='groups'>
                {skillGroups.map(([h, p]) => <div className='group' key={h}><h3>{h}</h3><p>{p}</p></div>)}
              </div>
            </div>
          </section>

          <section id='contact' aria-labelledby='contact-h'>
            <div className='contact'>
              <h2 id='contact-h'>Have a hard integration problem?</h2>
              <p>I'm open to senior and technical lead roles in full stack, commerce and AI products. Write to me and I'll answer within a day.</p>
              <CopyEmail />
            </div>
            <footer className='foot'>
              <span>© {new Date().getFullYear()} Andrés Julián Bustos</span>
              <Link to='/privacy/'>Privacy policy</Link>
              <Link to='/terms/'>Terms of service</Link>
              <span>Icons: Devicon (MIT)</span>
            </footer>
          </section>
        </main>
      </div>
    </>
  )
}

export const Head = () => <SEO />

export default IndexPage
