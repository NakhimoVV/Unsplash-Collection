import Link from 'next/link'
import LogoIcon from '@/shared/assets/Logo.svg'
import styles from './Logo.module.scss'

const Logo = () => {
  const title = 'Home'

  return (
    <Link className={styles.logo} href="/" title={title} aria-label={title}>
      <LogoIcon width={118} height={24} />
    </Link>
  )
}

export default Logo
