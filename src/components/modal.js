import { motion } from 'framer-motion'
import Backdrop from './backdrop'
import React from 'react'
import '../styles/c-modal.scss'
import { StaticImage } from 'gatsby-plugin-image'
import Technologies from './Technologies'
import { useEffect } from 'react'
import { useState } from 'react'

const dropIn = {
  hidden: {
    y: '-100vh',
    opacity: 0,
  },
  visible: {
    y: '0',
    opacity: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: '100vh',
    opacity: 0,
  },
}

const globant = {
  title: 'El Palacio de Hierro',
  stack: ['react', 'salesforce', 'javascript'],
  image: (
    <StaticImage
      src="../images/eph.jpg"
      placeholder="blurred"
      height={300}
      alt="eph"
      transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
    />
  ),
  link: 'https://elpalaciodehierro.com',
  functions: [
    'Developed and maintained e-commerce websites using Salesforce Commerce Cloud platform.',
    'Collaborated with cross-functional teams to design and implement new features and functionalities to improve website performance and user experience.',
    'Optimized website speed and performance by implementing lazy loading, code splitting and other techniques.',
    'Created and maintained reusable components, modules and libraries for front-end development.',
    'Contributed to the development of the company’s internal front-end development guidelines and best practices.',
  ],
}

const epam = {
  title: 'Equality Health Platform',
  stack: ['react', 'node', 'nextjs'],
  image: (
    <StaticImage
      src="../images/eqh.jpg"
      placeholder="blurred"
      height={300}
      alt="eph"
      transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
    />
  ),
  link: 'https://www.equalityhealth.com',
  functions: [
    'Developed and maintained e-commerce websites using Salesforce Commerce Cloud platform.',
    'Collaborated with cross-functional teams to design and implement new features and functionalities to improve website performance and user experience.',
    'Optimized website speed and performance by implementing lazy loading, code splitting and other techniques.',
    'Created and maintained reusable components, modules and libraries for front-end development.',
    'Contributed to the development of the company’s internal front-end development guidelines and best practices.',
  ],
}

const grability = {
  title: 'Bolsa de Valores de Colombia',
  stack: ['react', 'javascript', 'nextjs'],
  image: (
    <StaticImage
      src="../images/bvc.jpg"
      placeholder="blurred"
      height={300}
      alt="eph"
      transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
    />
  ),
  link: 'https://www.bvc.com.co',
  functions: [
    'Developed and maintained e-commerce websites using Salesforce Commerce Cloud platform.',
    'Collaborated with cross-functional teams to design and implement new features and functionalities to improve website performance and user experience.',
    'Optimized website speed and performance by implementing lazy loading, code splitting and other techniques.',
    'Created and maintained reusable components, modules and libraries for front-end development.',
    'Contributed to the development of the company’s internal front-end development guidelines and best practices.',
  ],
}

const pearls = {
  title: 'Cyberbank (Technisys)',
  stack: ['react', 'reactNative', 'nextjs', 'node'],
  image: (
    <StaticImage
      src="../images/cyberbank.png"
      placeholder="blurred"
      height={300}
      alt="eph"
      transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
    />
  ),
  link: 'https://www.technisys.com/cyberbank/',
  functions: [
    'Developed and maintained e-commerce websites using Salesforce Commerce Cloud platform.',
    'Collaborated with cross-functional teams to design and implement new features and functionalities to improve website performance and user experience.',
    'Optimized website speed and performance by implementing lazy loading, code splitting and other techniques.',
    'Created and maintained reusable components, modules and libraries for front-end development.',
    'Contributed to the development of the company’s internal front-end development guidelines and best practices.',
  ],
}

const Modal = ({ handleClose, text }) => {
  const [content, setContent] = useState(globant);

  useEffect(() => {
    switch (text) {
      case 'globant':
        setContent(globant)
        break;
      case 'epam':
        setContent(epam)
        break;
      case 'grability':
        setContent(grability)
        break;
      case 'pearls':
        setContent(pearls)
        break;
      default:
        break;
    }
  }, [text])
  
  return (
    <Backdrop onClick={handleClose}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="modal"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="content">
          <div className="header">
            <h1>{content.title}</h1>
            <Technologies
              stack={content.stack}
              styles={{
                marginTop: '0',
                marginBottom: '20px',
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
              }}
            />
          </div>
          <div className="image">
            {content.image}
            <a href={content.link} target="_blank">
              <div>
                <button className='button-86'>
                  LIVE
                </button>
              </div>
            </a>
          </div>
        </div>
      </motion.div>
    </Backdrop>
  )
}

export default Modal
