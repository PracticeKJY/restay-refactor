"use client"

import { FC, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./ListingsCard.module.css"
import Image from "next/image"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import useCountries from "@/pages/@hooks/useCountries"
import { Swiper, SwiperSlide } from "swiper/react"
import SwiperCore, { Swiper as SwiperType, Navigation } from "swiper"
import { useRef } from "react"

import "swiper/css"
import "swiper/css/navigation"

SwiperCore.use([Navigation])

interface ListingsCardProps {
  data: any
  userId: any
}

const ListingsCard: FC<ListingsCardProps> = ({ data, userId }) => {
  const [hasFavorite, setHasFavorite] = useState(false)
  const [isHover, setIsHover] = useState(false)

  const router = useRouter()

  const handleSetFavorite = () => {
    setHasFavorite(!hasFavorite)
  }
  const { getByValue } = useCountries()
  const location = getByValue(data.locationValue)

  const productCards = data.imageSrc.map((src: string, index: any) => {
    return (
      <SwiperSlide key={index}>
        <Image
          width={350}
          height={350}
          alt=""
          src={src}
          className={styles.listingsImage}
          onClick={() => {
            router.push(`/listings/${data._id}`)
          }}
          priority
        />
      </SwiperSlide>
    )
  })

  const swiperRef = useRef<SwiperType>()

  const localePrice = data.price.toLocaleString("ko-KR")

  return (
    <>
      <div
        className={styles.listingsWrapper}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
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
        <div onClick={handleSetFavorite}>
          {hasFavorite ? (
            <AiFillHeart size={28} className={styles.aiFillHeart} />
          ) : (
            <AiOutlineHeart size={28} className={styles.aiOutlineHeart} />
          )}
        </div>
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

        <div
          onClick={() => {
            router.push(`/listings/${data._id}`)
          }}
        >
          <div className={styles.listingsLocation}>
            {location?.region}, {location?.label}
          </div>
          <div className={styles.listingsCategory}>{data.category}</div>
          <div className={styles.listingsTitle}>{data.title}</div>
          <div>
            <span className={styles.listingsPrice}>￦{localePrice}</span>
            /박
          </div>
        </div>
      </div>
    </>
  )
}

export default ListingsCard
