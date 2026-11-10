"use client"

import { FC } from "react"
import styles from "./CategoryInput.module.css"
import { IconType } from "react-icons"
import { useCategoryCopy } from "@/i18n/useCategoryCopy"

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
  const categoryCopy = useCategoryCopy()
  return (
    <div
      data-ui="category-input"
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onClick(label); } }}
      onClick={() => onClick(label)}
      className={`${styles.categoryInputContainer} ${
        selected ? styles.isSelected : ""
      } }`}
    >
      <div className={styles.iconWrapper}>
        <Icon size={30} />
      </div>
      <div className={styles.labelContainer}>{categoryCopy(label)}</div>
    </div>
  )
}

export default CategoryInput
