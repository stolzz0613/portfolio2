import React, { useState } from 'react'
import '../../styles/c-companies.scss'
import { AnimatePresence } from 'framer-motion'
import Modal from '../modal'
import { getLogo, logos } from './logos'

const componentName = 'c-companies'

export default function Companies() {
  const [modalOpen, setModalOpen] = useState(false)
  const [text, setText] = useState('')

  const close = () => setModalOpen(false)
  const open = () => setModalOpen(true)

  const handleClick = (name) => {
    modalOpen ? close() : open()
    setText(name)
  }

  return (
    <div className={`${componentName}`}>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {modalOpen && (
          <Modal modalOpen={modalOpen} handleClose={close} text={text} />
        )}
      </AnimatePresence>
      <div onClick={() => handleClick('globant')}>{getLogo('globant')}</div>
      <div onClick={() => handleClick('epam')}>{getLogo('epam')}</div>
      <div onClick={() => handleClick('grability')}>
      {getLogo('grability')}
      </div>
      <div onClick={() => handleClick('pearls')}>{getLogo('pearls')}</div>
    </div>
  )
}
