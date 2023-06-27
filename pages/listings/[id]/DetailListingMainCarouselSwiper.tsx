"use client"

import styles from "./DetailListingPage.module.css"

import { FC, useRef, useState } from "react"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, {
  Swiper as SwiperType,
  Navigation,
  FreeMode,
  Thumbs,
} from "swiper"

import "swiper/css"
import "swiper/css/navigation"

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

SwiperCore.use([Navigation])

const DetailListingMainCarouselSwiper: FC<
  DetailListingMainCarouselSwiperProps
> = ({ listingData }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null)
  const swiperRef = useRef<SwiperType>()
  const [slideIndex, setslideIndex] = useState(0)

  const findSwiperIndexHandler = (swiper: any) => {
    setslideIndex(swiper.realIndex)
  }

  const productCards = listingData.imageSrc?.map((src: string, index: any) => {
    return (
      <SwiperSlide key={index}>
        <Image
          width={560}
          height={348}
          alt=""
          src={src}
          className={styles.productCards}
          priority
        />
      </SwiperSlide>
    )
  })
  const productCardsList = listingData.imageSrc?.map(
    (src: string, index: any) => {
      return (
        <SwiperSlide
          key={index}
          className={`${styles.swiperSlide} ${
            slideIndex === index ? styles.active : ""
          }`}
        >
          <Image
            width={120}
            height={100}
            alt=""
            src={src}
            className={styles.productCardsListImage}
            priority
          />
        </SwiperSlide>
      )
    },
  )

  return (
    <div className={styles.swiperWrapper}>
      <Swiper
        className={styles.swiper}
        onSlideChange={findSwiperIndexHandler}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        loop
        slidesPerGroup={1}
        slidesPerView={1}
        spaceBetween={0}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper
        }}
      >
        {productCards}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={0}
        slidesPerView={4}
        freeMode={true}
        loop
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className={styles.swiperList}
      >
        {productCardsList}
      </Swiper>
      <button
        className={styles.prevButton}
        onClick={() => swiperRef.current?.slidePrev()}
      >
        {"<"}
      </button>
      <button
        className={styles.nextButton}
        onClick={() => swiperRef.current?.slideNext()}
      >
        {">"}
      </button>
    </div>
  )
}

export default DetailListingMainCarouselSwiper
