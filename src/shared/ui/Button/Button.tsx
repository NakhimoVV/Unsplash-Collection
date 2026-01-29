import { ComponentType, SVGProps } from 'react'
import styles from './Button.module.scss'

type ButtonProps = {
  label: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  download?: boolean
  href?: string
  onClick?: () => void
}

const Button = (props: ButtonProps) => {
  const { label, icon: Icon, download, href, onClick } = props
  // TODO: Добавить возможность скачивания через <a> + download

  const Component = download || href ? 'a' : 'button'
  const downloadProps = {
    href,
    download: download,
    target: '_blank',
    rel: 'nofollow',
  }
  const dependentProps = download && href ? downloadProps : null

  return (
    <Component className={styles.button} {...dependentProps} onClick={onClick}>
      {Icon && <Icon className={styles.icon} width={16} height={16} />}
      <span>{label}</span>
    </Component>
  )
}

export default Button
