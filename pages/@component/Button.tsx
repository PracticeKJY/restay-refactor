"use client"

import { FC } from "react"
import { IconType } from "react-icons"
import Image from "next/image"

import styles from "./Button.module.css"

interface ButtonProps {
  label: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  outline?: boolean
  small?: boolean
  icon?: IconType | string
  alt?: string
}

const Button: FC<ButtonProps> = ({
  label,
  onClick,
  disabled,
  outline,
  small = false,
  icon: Icon,
  alt,
}) => {
  // const modalTransitionClass = showModal ? styles.modalShow : styles.modalHide

  const outlineClass = outline ? styles.isOutline : styles.nonOutline
  const smallClass = small ? styles.isSmall : styles.nonSmall

  // <div className={`${styles.button} ${outlineClass} ${smallClass}`}>

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${outlineClass} ${smallClass}`}
    >
      {typeof Icon === "string" ? (
        <Image
          src={Icon}
          alt={alt || ""}
          width={25}
          height={25}
          className={styles.Image}
        />
      ) : (
        Icon && <Icon size={24} className={styles.Image} />
      )}
      {label}
    </button>
  )
}

export default Button
