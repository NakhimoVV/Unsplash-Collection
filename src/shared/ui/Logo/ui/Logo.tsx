import styles from './Logo.module.scss'
import Link from 'next/link'
import Image from 'next/image'
import LogoIcon from '@/shared/assets/Logo.svg'

const Logo = () => {
  const title = 'Home'

  return (
    <Link className={styles.logo} href="/" title={title} aria-label={title}>
      <Image src={LogoIcon} alt="Logo" width={118} height={24} />
    </Link>
  )
}

export default Logo
