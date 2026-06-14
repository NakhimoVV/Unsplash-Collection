import { ComponentType, MouseEventHandler, SVGProps } from 'react'

import styles from './Button.module.scss'

type ButtonProps = {
  label: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  download?: boolean
  href?: string
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
}

const Button = (props: ButtonProps) => {
  const { label, icon: Icon, download, href, onClick } = props

  if (href) {
    return (
      <a
        className={styles.button}
        download={download || undefined}
        href={href}
        onClick={onClick}
        rel={download ? 'nofollow' : undefined}
        target={download ? '_blank' : undefined}
      >
        {Icon && <Icon className={styles.icon} width={16} height={16} />}
        <span>{label}</span>
      </a>
    )
  }

  return (
    <button className={styles.button} onClick={onClick} type="button">
      {Icon && <Icon className={styles.icon} width={16} height={16} />}
      <span>{label}</span>
    </button>
  )
}

export default Button
