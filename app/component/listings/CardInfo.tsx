"use client"
import { useLocale, useTranslations } from "next-intl";


import { useRouter } from "@/i18n/navigation"
import styles from "./ListingsCard.module.css"
import { useCategoryCopy } from "@/i18n/useCategoryCopy"
import type { ListingCardSummary } from "@/types/listing-card"

const CardInfo = ({ data }: { data: ListingCardSummary }) => {
  const t = useTranslations("Listings");
  const locale = useLocale();
  const categoryCopy = useCategoryCopy();

  const router = useRouter()
  const location = data.location
  const [si, gu] = location.split(" ")

  const localePrice = data.price.toLocaleString(locale === "en" ? "en-US" : "ko-KR")
  return (
    <div
      data-card-info role="link"
      tabIndex={0}
      onKeyDown={(event) => { if (event.key === "Enter") router.push(`/listings/${data._id}`) }}
      onClick={() => {
        router.push(`/listings/${data._id}`)
      }}
    >
      <div className={styles.listingsLocation}>
        {gu} {si}  {t("southKorea")}</div>
      <div className={styles.listingsCategory}>{categoryCopy(data.category)}</div>
      <div className={styles.listingsTitle}>{data.title}</div>
      <div>
        <span className={styles.listingsPrice}>￦{localePrice}</span>
        {t("night")}</div>
    </div>
  )
}

export default CardInfo
