"use client"
import { useTranslations } from "next-intl";


import styles from "./Reservation.module.css"
import Image from "next/image"

const Rule = () => {
  const t = useTranslations("Reservation");

  return (
    <div className={styles.ruleContainer}>
      <div className={styles.ruleTitle}>{t("groundRules")}</div>
      <div className={styles.ruleIntro}>
        {t("weAskEveryGuestToFollowA")}</div>
      <ul className={styles.ruleList}>
        <li>
          <span>{t("first")}</span>{t("followTheHouseRules")}</li>
        <li>
          <span>{t("second")}</span>{t("treatYourHostSHomeLikeYour")}</li>
      </ul>
      <div className={styles.confirmedInfoContainer}>
        <div className={styles.confirmedImage}>
          <Image
            alt=""
            src={"/ic-conf-reservation.svg"}
            width={30}
            height={30}
          />
        </div>
        <div>
          <span>
            {t("yourReservationIsNotConfirmedUntilThe")}</span>{" "}
          {t("youWillNotBeChargedUntilYour")}</div>
      </div>
    </div>
  )
}

export default Rule
