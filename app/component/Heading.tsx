"use client"

import { FC } from "react"
import styles from "./Heading.module.css"
interface HeadingProps {
  title: string
  subTitle?: string
  center?: boolean
}

const Heading: FC<HeadingProps> = ({ title, subTitle, center }) => {
  return (
    <div className={`${center ? styles.center : styles.headingWrapper}`}>
      <div className={styles.title}>{title}</div>
      <div className={styles.subtitle}>{subTitle}</div>
    </div>
  )
}

export default Heading
