import styles from './Hero.module.scss'
import clsx from 'clsx'
import SearchForm from '@/features/SearchForm'

type HeroProps = {}

const Hero = (props: HeroProps) => {
  const {} = props
  const titleId = 'hero-title'

  return (
    <section className={styles.hero} aria-labelledby={titleId}>
      <div className={styles.background}>
        <div className={clsx(styles.decoration, styles.left)}></div>
        <div className={styles.body}>
          <header className={styles.header}>
            <span className={styles.label}>Search</span>
            <h1 className={styles.title} id={titleId}>
              Search high-resolution images from Unsplash
            </h1>
          </header>
          <SearchForm />
        </div>
        <div className={clsx(styles.decoration, styles.right)}></div>
      </div>
    </section>
  )
}

export default Hero
