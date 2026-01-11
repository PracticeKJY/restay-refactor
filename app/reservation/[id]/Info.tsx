"use client"

import { FC, useState } from "react"
import styles from "./Reservation.module.css"
import "react-datepicker/dist/react-datepicker.css"
import moment from "moment"
import DatePickerComponent from "@/pages/@component/DatePicker/DatePickerComponent"

interface InfoProps {
  startDate: Date
  endDate: Date
}

const Info: FC<InfoProps> = ({ startDate, endDate }) => {
  const startMonth = moment(startDate).format("M")
  const startDay = moment(startDate).format("D")
  const endMonth = moment(endDate).format("M")
  const endDay = moment(endDate).format("D")
  const [toggle, setToggle] = useState(false)

  const onClick = () => {
    setToggle(!toggle)
  }

  const datePicker = (
    <>
      <div className={styles.triangle}>{""}</div>
      <DatePickerComponent onClick={onClick} />
    </>
  )

  return (
    <div className={styles.reservationWrapper}>
      <div>
        <div className={styles.infoTitle}>예약 정보</div>
        <div className={styles.infoWrapper}>
          <div>
            <div className={styles.dataTitle}>날짜</div>
            <div className={styles.data}>
              {startMonth === endMonth
                ? `${startMonth}월 ${startDay}일 ~ ${endDay}일`
                : `${startMonth}월 ${startDay}일 ~ ${endMonth}월 ${endDay}일`}
            </div>
          </div>
          <div className={styles.modifyDate}>
            <button className={styles.modifyButton} onClick={onClick}>
              수정
            </button>
            <div className={styles.modifyDateWrapper}>
              {toggle && datePicker}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Info
