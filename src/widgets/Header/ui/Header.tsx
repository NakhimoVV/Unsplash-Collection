import styles from './Header.module.scss'

type HeaderProps = {
  className?: string
}

const Header = (props: HeaderProps) => {
  const {} = props

  return (<header className={styles.header}>
    <p>Привет я хедер</p>
  </header>         )
}

export default Header