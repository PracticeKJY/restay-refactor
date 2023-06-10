"use client"

import styles from "./ListingsInfo.module.css"
import useCountries from "@/pages/@hooks/useCountries"
import dynamic from "next/dynamic"
import { FC, useMemo, useState } from "react"
import { categories } from "../Header/Categories"
import ListingCategory from "./ListingCategory"

interface ListingsInfoProps {
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
}

const ListingsInfo: FC<ListingsInfoProps> = ({ listingData }) => {
  const { getByValue } = useCountries()
  const location = getByValue(listingData.locationValue)
  const [isMore, setIsMore] = useState(false)

  const MapComponent = useMemo(
    () =>
      dynamic(() => import("@/pages/@component/MapComponent"), {
        ssr: false,
      }),
    [location],
  )

  const findCategory = categories.filter((item) => {
    return item.label === listingData.category
  })

  return (
    <div className={styles.hostDataContainer}>
      <div className={styles.hostingIntroduceInfo}>
        <div>
          <h2 className={styles.hostingIntroduce}>함찌 님이 호스팅하는 숙소</h2>
        </div>
        <ol className={styles.countList}>
          <li>{`최대 인원 ${listingData.guestCount}명`}</li>
          <li>{`방 ${listingData.roomCount}개`}</li>
          <li>{`욕실 ${listingData.bathroomCount}개`}</li>
        </ol>
      </div>
      <div className={styles.locationInfo}>
        {findCategory && (
          <ListingCategory
            icon={findCategory[0].icon}
            label={findCategory[0]?.label}
            description={findCategory[0]?.description}
          />
        )}
      </div>
      <div className={styles.descriptionWrapper}>
        <div className={styles.descriptionInfoWrapper}>
          <div
            className={`${
              !isMore ? styles.descriptionInfo : styles.descriptionInfoMore
            }`}
          >
            {listingData.description}
          </div>
          <div className={styles.moreDescription}>
            <button
              className={styles.moreDescriptionButton}
              onClick={() => {
                setIsMore(!isMore)
              }}
            >
              <span className={styles.moreDescriptionText}>
                {!isMore ? "더 보기" : "접기"}
              </span>
              <span>{">"}</span>
            </button>
          </div>
        </div>
      </div>
      <div className={styles.mapInfo}>
        <div>호스팅 지역</div>
        <MapComponent center={location?.latlng} />
      </div>
    </div>
  )
}

export default ListingsInfo
