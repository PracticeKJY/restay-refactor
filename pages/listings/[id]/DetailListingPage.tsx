"use client"

import styles from "./DetailListingPage.module.css"

import { FC, useRef } from "react"

import Container from "@/pages/@component/Container"
import ListingsInfo from "@/pages/@component/listings/ListingsInfo"
import ListingsReservation from "@/pages/@component/listings/ListingsReservation"
import DetailListingHeading from "./DetailListingHeading"
import DetailListingMainCarouselSwiper from "./DetailListingMainCarouselSwiper"
import MiniHeader from "./MiniHeader"
import KakaoMap from "@/pages/@component/KakaoMap"

interface DetailListingMainCarouselSwiperProps {
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

  const center = {
    lat: Number(listingData.latlngData.lat),
    lng: Number(listingData.latlngData.lng),
  }

  return (
    <>
      <MiniHeader topRef={topRef} bodyRef={bodyRef} mapRef={mapRef} />
      <div ref={topRef}>
        <Container>
          <div className={styles.contentContainer}>
            <div className={styles.mainCarousel}>
              <DetailListingMainCarouselSwiper listingData={listingData} />
              <DetailListingHeading listingData={listingData} />
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
                <KakaoMap center={center} />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export default DetailListingPage
