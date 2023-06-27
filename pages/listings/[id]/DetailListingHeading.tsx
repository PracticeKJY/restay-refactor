"use client"

import { FC } from "react"
import styles from "./DetailListingHeading.module.css"
import Heading from "@/pages/@component/Heading"

interface DetailListingHeadingProps {
  listingData: {
    category: string
    location: string
    guestCount: number
    roomCount: number
    bathroomCount: number
    imageSrc: string[] | undefined
    price: number
    title: string
    description: string
    userId: any
    createdAt: any
    _id: string
    latlngData: any
  }
  userInfo: any
}

const DetailListingHeading: FC<DetailListingHeadingProps> = ({
  listingData,
}) => {
  const location = listingData.location

  return (
    <div className={styles.infoContainer}>
      <div className={styles.headingContainer}>
        <Heading title={listingData.title} subTitle={location} />
      </div>

      <div className={styles.comment}>
        <span className={styles.commentTitle}>{"사장님 한마디"}</span>
        <div className={styles.commentBody}>
          {
            "이 곳에서 머무르실 모든 분들께서 편안하고 행복한 시간을 보내시길 바랍니다. 힐링 할 수 있는 여행을 준비해보세요."
          }
        </div>
      </div>
    </div>
  )
}

export default DetailListingHeading
