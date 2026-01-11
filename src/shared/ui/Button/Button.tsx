import { ComponentType, SVGProps } from 'react'
import styles from './Button.module.scss'

type ButtonProps = {
  label: string
  icon?: ComponentType<SVGProps<SVGSVGElement>>
  onClick?: () => void
}

const Button = (props: ButtonProps) => {
  const { label, icon: Icon } = props
  // TODO: Добавить возможность скачивания через <a> + download
  return (
    <button className={styles.button}>
      {Icon && <Icon className={styles.icon} width={16} height={16} />}
      <span>{label}</span>
    </button>
  )
}

export default Button
