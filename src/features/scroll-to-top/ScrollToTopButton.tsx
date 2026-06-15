'use client'

import { useEffect, useState } from 'react'
import clsx from 'clsx'

import IconChevronsUp from '@/shared/assets/icons/ChevronsUp.svg'

import { scrollToPageTop, shouldShowScrollToTop } from './lib/scrollToTop'

import styles from './ScrollToTopButton.module.scss'

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(shouldShowScrollToTop(window.scrollY, window.innerHeight))
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })

    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  return (
    <button
      aria-hidden={!isVisible}
      aria-label="Scroll to top"
      className={clsx(styles.button, isVisible && styles.buttonVisible)}
      onClick={() => scrollToPageTop()}
      tabIndex={isVisible ? 0 : -1}
      type="button"
    >
      <IconChevronsUp aria-hidden="true" width={24} height={24} />
    </button>
  )
}

export default ScrollToTopButton
