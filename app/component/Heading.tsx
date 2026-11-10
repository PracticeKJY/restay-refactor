"use client"

import { FC } from "react"
import styles from "./Heading.module.css"
interface HeadingProps {
  title: string
  subTitle?: string
  center?: boolean
  as?: "div" | "h2" | "h3"
}

const Heading: FC<HeadingProps> = ({ title, subTitle, center, as: Title = "div" }) => {
  return (
    <div data-ui="heading" className={`${center ? styles.center : styles.headingWrapper}`}>
      <Title className={styles.title}>{title}</Title>
      <div className={styles.subtitle}>{subTitle}</div>
    </div>
  )
}

export default Heading
