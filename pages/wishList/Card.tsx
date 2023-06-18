"use Client"

import styles from "./Card.module.css"
import SwiperComponent from "../@component/listings/SwiperComponent"
import { FC, useState } from "react"

interface CardProps {
  data: any
  userId?: any
  title: string
}

const Card: FC<CardProps> = ({ data, title }: any) => {
  const [isHover, setIsHover] = useState(false)

  return (
    <>
      <div className={styles.cardContainer}>
        <div className={styles.cardWrapper}>
          <div
            className={styles.listingsWrapper}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <SwiperComponent data={data} isHover={isHover} />
          </div>
          <div className={styles.cardTitle}>{title}</div>
        </div>
      </div>
    </>
  )
}

export default Card
