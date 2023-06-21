"use Client"

import styles from "./Card.module.css"
import SwiperComponent from "../@component/listings/SwiperComponent"
import { FC, useState } from "react"
import { useAtomValue } from "jotai"
import { nextDateAtom } from "../@jotai/store/state"
import moment from "moment"

interface CardProps {
  data: any
  userId?: any
  title?: string
  startDay?: string
  endDay?: string
  disable?: boolean
}

const Card: FC<CardProps> = ({
  data,
  title,
  startDay,
  endDay,
  disable,
}: any) => {
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
            <SwiperComponent data={data} isHover={isHover} disable={disable} />
          </div>
          {title ? (
            <div className={styles.cardTitle}>{title}</div>
          ) : (
            <div className={styles.cardTitle}>
              예약일: {startDay} ~ {endDay}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Card
