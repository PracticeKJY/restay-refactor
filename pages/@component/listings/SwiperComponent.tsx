"use client"

import styles from "./SwiperComponent.module.css"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, { Swiper as SwiperType, Navigation } from "swiper"
import { FC, useRef } from "react"

import "swiper/css"
import "swiper/css/navigation"
import FavoriteButton from "./FavoriteButton"

SwiperCore.use([Navigation])

interface SwiperComponentProps {
  data: any
  isHover: any
  disable?: boolean
}

const SwiperComponent: FC<SwiperComponentProps> = ({
  data,
  isHover,
  disable = false,
}: any) => {
  const router = useRouter()

  const productCards = data.imageSrc.map((src: string, index: any) => {
    return (
      <SwiperSlide key={index}>
        <Image
          width={300}
          height={300}
          alt=""
          src={src}
          className={styles.listingsImage}
          onClick={() => {
            router.push(`/listings/${data._id}`)
          }}
        />
      </SwiperSlide>
    )
  })

  const swiperRef = useRef<SwiperType>()

  return (
    <>
      <Swiper
        className={styles.swiper}
        modules={[Navigation]}
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
      {disable ? "" : <FavoriteButton data={data} />}
      {/* <FavoriteButton data={data} /> */}
      <button
        className={`${styles.prevButton} ${
          isHover ? styles.visibleButton : ""
        }`}
        onClick={() => swiperRef.current?.slidePrev()}
      >
        {"<"}
      </button>
      <button
        className={`${styles.nextButton} ${
          isHover ? styles.visibleButton : ""
        }`}
        onClick={() => swiperRef.current?.slideNext()}
      >
        {">"}
      </button>
    </>
  )
}

export default SwiperComponent
