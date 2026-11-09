"use client";
import { useLocale, useTranslations } from "next-intl";


import { restayChargeAtom } from "../../../jotai/@store/state";
import styles from "./Reservation.module.css";
import { useAtomValue } from "jotai";
import moment from "moment";
import { FC } from "react";

interface PriceInfoProps {
  price: number;
  startDate: Date;
  endDate: Date;
}

const PriceInfo: FC<PriceInfoProps> = ({ price, startDate, endDate }) => {
  const t = useTranslations("Reservation");
  const common = useTranslations("Common");
  const locale = useLocale();

  const calculateDate = moment(endDate).diff(moment(startDate), "days");
  const localePrice = price.toLocaleString(locale === "en" ? "en-US" : "ko-KR");
  const calculatedPrice = price * calculateDate;
  const formattedCalculatedPrice = calculatedPrice.toLocaleString(locale === "en" ? "en-US" : "ko-KR");
  const restayCharge = useAtomValue(restayChargeAtom);
  const localeRestayCharge = (restayCharge * calculateDate).toLocaleString(locale === "en" ? "en-US" : "ko-KR");
  const addTotalPrice = (calculateDate * (price + restayCharge)).toLocaleString(locale === "en" ? "en-US" : "ko-KR");

  return (
    <>
      <div className={styles.priceInfoWrapper}>
        <div className={styles.calculatePriceWrapper}>
          <div>
            ₩{localePrice} x {common("stayNights", { count: calculateDate })}</div>
          <div>₩{formattedCalculatedPrice}</div>
        </div>
        <div className={styles.calculatePriceWrapper}>
          <span className={styles.restayCharge}>{t("restayServiceFee")}</span>
          <span>₩{localeRestayCharge}</span>
        </div>
      </div>
      <div className={styles.totalPriceWrapper}>
        <span>{t("total")}</span>
        <span>₩{addTotalPrice}</span>
      </div>
      <div className={styles.cautionText}>{t("yourCardIssuerMayChargeAdditionalFees")}</div>
    </>
  );
};

export default PriceInfo;
