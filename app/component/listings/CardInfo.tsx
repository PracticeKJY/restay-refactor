"use client"

import { useRouter } from "next/navigation"
import styles from "./ListingsCard.module.css"

const CardInfo = ({ data }: any) => {
  const router = useRouter()
  const location = data.location
  const [si, gu] = location.split(" ")

  const localePrice = data.price.toLocaleString("ko-KR")
  return (
    <div
      onClick={() => {
        router.push(`/listings/${data._id}`)
      }}
    >
      <div className={styles.listingsLocation}>
        {gu} {si} , 한국
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
