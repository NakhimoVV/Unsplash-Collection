import { ComponentType, MouseEventHandler, SVGProps } from 'react'
import clsx from 'clsx'

import styles from './Button.module.scss'

type ButtonProps = {
  label: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  download?: boolean
  href?: string
  onClick?: MouseEventHandler<HTMLAnchorElement | HTMLButtonElement>
  variant?: 'default' | 'large'
}

const Button = (props: ButtonProps) => {
  const {
    label,
    icon: Icon,
    download,
    href,
    onClick,
    variant = 'default',
  } = props
  const iconSize = variant === 'large' ? 28 : 16
  const className = clsx(styles.button, styles[variant])

  if (href) {
    return (
      <a
        className={className}
        download={download || undefined}
        href={href}
        onClick={onClick}
        rel={download ? 'nofollow' : undefined}
        target={download ? '_blank' : undefined}
      >
        {Icon && (
          <Icon className={styles.icon} width={iconSize} height={iconSize} />
        )}
        <span>{label}</span>
      </a>
    )
  }

  return (
    <button className={className} onClick={onClick} type="button">
      {Icon && (
        <Icon className={styles.icon} width={iconSize} height={iconSize} />
      )}
      <span>{label}</span>
    </button>
  )
}

export default Button
