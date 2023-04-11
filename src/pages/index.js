import React, {useState} from 'react'
import { StaticImage } from 'gatsby-plugin-image'
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { loadCardsShape } from "tsparticles-shape-cards";
import { tsParticles } from "tsparticles-engine";
import { options } from '../utils/backgroundOptions'
import {Modal, Companies, Technologies, UtilsBar, SEO} from '../components'
import { AnimatePresence } from 'framer-motion'

import '../styles/p-index.scss'


const componentName = 'p-index'

const IndexPage = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
    loadCardsShape(tsParticles);
  };

  const handleClick = (name) => {
    modalOpen ? close() : open()
    setText(name)
  }

  const [modalOpen, setModalOpen] = useState(false)
  const [text, setText] = useState('')

  const close = () => setModalOpen(false)
  const open = () => setModalOpen(true)

  return (
    <div className={`${componentName}`}>
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={options}
      />
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {modalOpen && (
          <Modal handleClose={close} text={text}/>
        )}
      </AnimatePresence>
      <UtilsBar />
      <div className={`${componentName}-info`}>
        <h1>{`<Andres Bustos />`}</h1>
        <h2 className={`${componentName}-info_position`}>FullStack developer</h2>
        <p className={`${componentName}-info_description`}>Passionate developer with +5 years of experience. Committed to delivering clean, responsive, and accessible websites optimized for performance and usability. Dedicated to providing the best possible user experience.</p>
        <Technologies stack={['react', 'nextjs', 'node', 'salesforce', 'javascript', 'native']}/>
      </div>
      <div>
        <StaticImage
          src='../../static/images/image.png'
          placeholder='blurred'
          width={600}
          height={600}
          alt='main image developer'
          title='main image developer'
          transformOptions={{ fit: 'cover', cropFocus: 'attention' }}
          loading='eager'
        />
      </div>
      <Companies handleClick={handleClick}/>
    </div>
  )
}

export const Head = () => <SEO />

export default IndexPage