"use client"
import { useLocale, useTranslations } from "next-intl";


import { FC } from "react"
import styles from "./CheckIn.module.css"
import Image from "next/image"
import moment from "moment"

interface CheckInProps {
  startDate: Date | null
  endDate: Date | null
  onClick: () => void
}

const CheckIn: FC<CheckInProps> = ({ startDate, endDate, onClick }) => {
  const t = useTranslations("Common");
  const locale = useLocale();

  const checkout = endDate ? moment(endDate) : moment(startDate).add(1, "days")
  const nights = endDate ? moment(endDate).diff(moment(startDate), "days") : 1
  const formatDate = (date: moment.Moment) => locale === "en" && date.isValid()
    ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date.toDate())
    : date.format("M.D")
  return (
    <button className={styles.checkIn} onClick={onClick}>
      <Image width={32} height={32} src="/icon_cal0.png" alt="" priority />
      <span className={styles.momentInfo}>
        <b>{` ${formatDate(moment(startDate))} . ${formatDate(checkout)}`}</b>{" "}
        <em>· {t("stayNights", { count: nights })}</em>
      </span>
      <Image className={styles.arrDown} width={24} height={24} src="/ico_arr_down.png" alt="" priority />
    </button>
  )
}

export default CheckIn
