import styles from './PageHeader.module.scss'
import { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  subtitle: string | ReactNode
}

const PageHeader = (props: PageHeaderProps) => {
  const { title, subtitle } = props

  return (
    <header className={styles.pageHeader}>
      <h1 className={styles.title}>{title}</h1>
      <p>{subtitle}</p>
    </header>
  )
}

export default PageHeader
