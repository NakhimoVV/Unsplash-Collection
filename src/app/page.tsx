import styles from './ui/Home.module.scss'
import Hero from '@/widgets/Hero'

export default function Home() {
  return (
    <main className={styles.home}>
      <Hero />
    </main>
  )
}
