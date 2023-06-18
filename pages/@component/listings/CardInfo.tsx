"use client"

import { FC, useState } from "react"
import { useRouter } from "next/navigation"
import styles from "./ListingsCard.module.css"
import useCountries from "@/pages/@hooks/useCountries"

const CardInfo = ({ data }: any) => {
  const router = useRouter()
  const { getByValue } = useCountries()
  const location = getByValue(data.locationValue)

  const localePrice = data.price.toLocaleString("ko-KR")

  return (
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
  )
}

export default CardInfo
