"use client"

import styles from "./DetailListingPage.module.css"

import { FC, useMemo, useRef } from "react"
import useCountries from "@/pages/@hooks/useCountries"
import dynamic from "next/dynamic"

import Container from "@/pages/@component/Container"
import ListingsInfo from "@/pages/@component/listings/ListingsInfo"
import ListingsReservation from "@/pages/@component/listings/ListingsReservation"
import DetailListingHeading from "./DetailListingHeading"
import DetailListingMainCarouselSwiper from "./DetailListingMainCarouselSwiper"
import MiniHeader from "./MiniHeader"

interface DetailListingMainCarouselSwiperProps {
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

interface DetailListingPageProps extends DetailListingMainCarouselSwiperProps {
  userInfo: any
}

const DetailListingPage: FC<DetailListingPageProps> = ({
  listingData,
  userInfo,
}) => {
  const topRef = useRef(null)
  const bodyRef = useRef(null)
  const mapRef = useRef(null)
  const { getByValue } = useCountries()
  const location = getByValue(listingData.locationValue)
  const MapComponent = useMemo(
    () =>
      dynamic(() => import("@/pages/@component/MapComponent"), {
        ssr: false,
      }),
    [location],
  )

  return (
    <>
      <MiniHeader topRef={topRef} bodyRef={bodyRef} mapRef={mapRef} />
      <div ref={topRef}>
        <Container>
          <div className={styles.contentContainer}>
            <div className={styles.mainCarousel}>
              <DetailListingMainCarouselSwiper listingData={listingData} />
              <DetailListingHeading
                listingData={listingData}
                userInfo={userInfo}
              />
            </div>
            <div className={styles.bodyContainer} ref={bodyRef}>
              <ListingsInfo listingData={listingData} userInfo={userInfo} />
              <ListingsReservation
                price={listingData.price}
                listingData={listingData}
              />
            </div>
            <div className={styles.mapInfoWrapper}>
              <div className={styles.mapInfo} ref={mapRef}>
                <div className={styles.mapInfoTitle}>호스팅 위치</div>
                <MapComponent center={location?.latlng} />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export default DetailListingPage
