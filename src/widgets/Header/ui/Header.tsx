import Logo from '@/shared/ui/Logo'
import NavLinks from '@/shared/ui/NavLinks'

import styles from './Header.module.scss'

type HeaderProps = {
  className?: string
}

const Header = (props: HeaderProps) => {
  const {} = props

  return (
    <header className={styles.header}>
      <div className={styles.headerContainer}>
        <Logo />
        <NavLinks />
      </div>
    </header>
  )
}

export default Header
