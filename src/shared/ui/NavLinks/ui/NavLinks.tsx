'use client'

import styles from './NavLinks.module.scss'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

type NavLinksProps = {}

const NavLinks = (props: NavLinksProps) => {
  const {} = props
  const pathname = usePathname()

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/collections' },
  ]

  return (
    <nav className={styles.navLinks}>
      {links.map((link) => (
        <Link
          className={clsx(styles.link, {
            [styles.activeLink]: pathname === link.href,
          })}
          href={link.href}
          key={link.name}
        >
          {link.name}
        </Link>
      ))}
    </nav>
  )
}

export default NavLinks
