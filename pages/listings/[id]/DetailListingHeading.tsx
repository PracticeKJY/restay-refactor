"use client"

import { FC } from "react"
import styles from "./DetailListingHeading.module.css"
import useCountries from "@/pages/@hooks/useCountries"
import Heading from "@/pages/@component/Heading"

interface DetailListingHeadingProps {
  listingData: {
    category: string
    locationValue: string
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
  }
  userInfo: any
}

const DetailListingHeading: FC<DetailListingHeadingProps> = ({
  listingData,
}) => {
  const { getByValue } = useCountries()
  const location = getByValue(listingData.locationValue)

  return (
    <div className={styles.infoContainer}>
      <div className={styles.headingContainer}>
        <Heading
          title={listingData.title}
          subTitle={`${location?.region}, ${location?.label}`}
        />
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
