import styles from './Button.module.scss'
import { ComponentType, SVGProps } from 'react'

type ButtonProps = {
  label: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  onClick?: () => void
}

const Button = (props: ButtonProps) => {
  const { label, icon: Icon } = props

  return (
    <button className={styles.button}>
      {Icon && <Icon className={styles.icon} width={16} height={16} />}
      <span>{label}</span>
    </button>
  )
}

export default Button
