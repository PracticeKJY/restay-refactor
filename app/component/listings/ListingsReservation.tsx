"use client";
import { useLocale, useTranslations } from "next-intl";


import styles from "./ListingsReservation.module.css";
import "react-datepicker/dist/react-datepicker.css";
import Button from "../Button";
import { calendarOpenAtom, restayChargeAtom, endDateAtom, startDateAtom } from "../../../jotai/@store/state";
import CheckIn from "../DatePicker/CheckIn";
import DatePickerComponent from "../DatePicker/DatePickerComponent";
import { FC } from "react";
import moment from "moment";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "@/i18n/navigation";

interface ListingsReservationProps {
  price: number;
  listingData: any;
  sessionEmail?: string | null;
}

const ListingsReservationClient: FC<ListingsReservationProps> = ({ price, listingData, sessionEmail }) => {
  const t = useTranslations("Listings");
  const common = useTranslations("Common");
  const locale = useLocale();

  const router = useRouter();

  const startDate = useAtomValue(startDateAtom);
  const endDate = useAtomValue(endDateAtom);
  const restayCharge = useAtomValue(restayChargeAtom);
  const toggle = useAtomValue(calendarOpenAtom);
  const setToggle = useSetAtom(calendarOpenAtom);

  const isLoggedIn = !!sessionEmail;

  const validationEndDate = moment(endDate).format("M.D");
  const calculateDate: number = endDate ? moment(endDate).diff(moment(startDate), "days") : 1;

  const localePrice = price.toLocaleString(locale === "en" ? "en-US" : "ko-KR");
  const localeTotalPrice = (price * calculateDate).toLocaleString(locale === "en" ? "en-US" : "ko-KR");
  const localeRestayCharge = (restayCharge * calculateDate).toLocaleString(locale === "en" ? "en-US" : "ko-KR");
  const addTotalPrice = (calculateDate * (price + restayCharge)).toLocaleString(locale === "en" ? "en-US" : "ko-KR");

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  const priceInfo = (
    <div className={styles.priceInfoWrapper}>
      <div className={styles.priceInfo}>₩{localePrice}  {t("night")}</div>
      <div className={styles.reviewInfoWrapper}>
        ★<span className={styles.reviewScore}>4.85</span> · <span className={styles.reviewCount}>{t("4Reviews")}</span>
      </div>
    </div>
  );

  return (
    <div className={styles.dataPickerContainer}>
      <div className={styles.dataPickerWrapper}>
        {endDate === null ? <div>{t("selectDatesToSeeThePrice")}</div> : priceInfo}

        <CheckIn startDate={startDate} endDate={endDate} onClick={toggleHandler} />
        {toggle && <DatePickerComponent onClick={toggleHandler} />}

        <Button
          label={t("reserve")}
          onClick={() => {
            if (!isLoggedIn) {
              return alert(t("pleaseLogInToContinue"));
            }

            if (validationEndDate === "Invalid date") {
              return alert(t("pleaseSelectYourDatesAgain"));
            }

            router.push(`/reservation/${listingData._id}`);
          }}
        />

        <div className={styles.reservationInfoContainer}>
          <div className={styles.reservationInfoRule}>{t("youWillNotBeChargedBeforeYour")}</div>

          <div className={styles.reservationPriceContainer}>
            <div className={styles.reservationPriceWrapper}>
              <span className={styles.calculateReservationPrice}>
                ₩{localePrice} x {common("stayNights", { count: calculateDate })}</span>
              <span>₩{localeTotalPrice}</span>
            </div>

            <div className={styles.restayChargeInfoWrapper}>
              <span className={styles.restayChargeInfo}>{t("restayServiceFee")}</span>
              <span>₩{localeRestayCharge}</span>
            </div>
          </div>

          <div className={styles.totalPriceWrapper}>
            <span>{t("total")}</span>
            <span>₩{addTotalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingsReservationClient;
