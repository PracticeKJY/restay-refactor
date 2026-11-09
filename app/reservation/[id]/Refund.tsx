"use client"
import { useTranslations } from "next-intl";


import styles from "./Reservation.module.css"

const Refund = () => {
  const t = useTranslations("Reservation");

  return (
    <div className={styles.refundContainer}>
      <div className={styles.refundTitle}>{t("cancellationPolicy")}</div>
      <div className={styles.refundInfo}>
        <div>
          <span>{t("upToOneWeekBeforeYourStay")}</span>{t("youCanCancelForFree")}</div>
        <div>
          <span>{t("fromSixDaysBeforeYourStay")}</span>{t("youMayReceiveAPartialRefund")}</div>
        <div className={styles.refundMore}>{t("learnMore")}</div>
      </div>
    </div>
  )
}

export default Refund
