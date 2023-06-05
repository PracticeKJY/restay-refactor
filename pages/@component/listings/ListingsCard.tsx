"use client"

import { FC, useState } from "react"
import styles from "./ListingsCard.module.css"
import Image from "next/image"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import { useRecoilState } from "recoil"
import { hasFavoriteAtom } from "@/pages/@recoil/store/state"
import useCountries from "@/pages/@hooks/useCountries"

const ListingsCard = ({ data, userId }) => {
  // const [hasFavorite, setHasFavorite] = useRecoilState(hasFavoriteAtom)
  const [hasFavorite, setHasFavorite] = useState(false)
  const handleSetFavorite = () => {
    setHasFavorite(!hasFavorite)
  }
  const { getByValue } = useCountries()
  const location = getByValue(data.locationValue)

  return (
    <div className={styles.listingsWrapper}>
      <Image
        width={350}
        height={350}
        alt=""
        src={data.imageSrc ? data.imageSrc[0] : ""}
        className={styles.listingsImage}
      />
      <div onClick={handleSetFavorite}>
        {hasFavorite ? (
          <AiFillHeart size={28} className={styles.aiFillHeart} />
        ) : (
          <AiOutlineHeart size={28} className={styles.aiOutlineHeart} />
        )}
      </div>
      <div className={styles.listingsLocation}>
        {location?.region}, {location?.label}
      </div>
      <div className={styles.listingsCategory}>{data.category}</div>
      <div className={styles.listingsTitle}>{data.title}</div>
      <div>
        <span className={styles.listingsPrice}>￦{data.price}</span>
        /박
      </div>
    </div>
  )
}

export default ListingsCard
