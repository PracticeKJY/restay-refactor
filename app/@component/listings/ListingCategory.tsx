"use client"

import styles from "./ListingCategory.module.css"
import { FC } from "react"
import { IconType } from "react-icons"

interface ListingCategoryProps {
  icon: IconType
  label: string
  description: string
}

const ListingCategory: FC<ListingCategoryProps> = ({
  icon: Icon,
  label,
  description,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Icon size={40} className={styles.icon} />
        <div className={styles.infoWrapper}>
          <div className={styles.label}>{label}</div>
          <div className={styles.description}>{description}</div>
        </div>
      </div>
    </div>
  )
}

export default ListingCategory
