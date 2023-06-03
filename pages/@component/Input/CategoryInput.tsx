"use client"

import { FC } from "react"
import styles from "./CategoryInput.module.css"
import { IconType } from "react-icons"

interface CategoryInput {
  onClick: (value: string) => void
  selected: boolean
  label: string
  icon: IconType
}

const CategoryInput: FC<CategoryInput> = ({
  onClick,
  selected,
  label,
  icon: Icon,
}) => {
  return (
    <div
      onClick={() => onClick(label)}
      className={`${styles.categoryInputContainer} ${
        selected ? styles.isSelected : ""
      } }`}
    >
      <Icon size={30} />
      <div className={styles.labelContainer}>{label}</div>
    </div>
  )
}

export default CategoryInput
