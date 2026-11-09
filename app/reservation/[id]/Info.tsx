"use client";
import { useTranslations } from "next-intl";


import { FC, useState } from "react";
import styles from "./Reservation.module.css";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import DatePickerComponent from "@/app/component/DatePicker/DatePickerComponent";

interface InfoProps {
  startDate: Date;
  endDate: Date;
}

const Info: FC<InfoProps> = ({ startDate, endDate }) => {
  const t = useTranslations("Reservation");

  const startMonth = moment(startDate).format("M");
  const startDay = moment(startDate).format("D");
  const endMonth = moment(endDate).format("M");
  const endDay = moment(endDate).format("D");
  const [toggle, setToggle] = useState(false);

  const onClick = () => {
    setToggle(!toggle);
  };

  const datePicker = (
    <>
      <div className={styles.triangle}>{""}</div>
      <DatePickerComponent onClick={onClick} />
    </>
  );

  return (
    <div className={styles.reservationWrapper}>
      <div>
        <div className={styles.infoTitle}>{t("yourReservation")}</div>
        <div className={styles.infoWrapper}>
          <div>
            <div className={styles.dataTitle}>{t("dates")}</div>
            <div className={styles.data}>
              {startMonth === endMonth ? t("dateRangeSameMonth", { p0: startMonth, p1: startDay, p2: endDay }) : t("dateRangeDifferentMonth", { p0: startMonth, p1: startDay, p2: endMonth, p3: endDay })}
            </div>
          </div>
          <div className={styles.modifyDate}>
            <button className={styles.modifyButton} onClick={onClick}>
              {t("edit")}</button>
            <div className={styles.modifyDateWrapper}>{toggle && datePicker}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Info;
