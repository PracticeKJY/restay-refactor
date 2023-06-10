"use client"

import styles from "./ListingsReservation.module.css"
import "react-datepicker/dist/react-datepicker.css"
import Button from "../Button"
import { useRecoilState, useRecoilValue } from "recoil"
import {
  isCalendarOpen,
  restayChargeAtom,
  useEndDate,
  useStartDate,
} from "@/pages/@recoil/store/state"
import CheckIn from "../DatePicker/CheckIn"
import DatePickerComponent from "../DatePicker/DatePickerComponent"
import { FC } from "react"
import moment from "moment"

interface ListingsReservationProps {
  price: number
}

const ListingsReservation: FC<ListingsReservationProps> = ({ price }) => {
  const startDate = useRecoilValue(useStartDate)
  const endDate = useRecoilValue(useEndDate)
  const restayCharge = useRecoilValue(restayChargeAtom)
  const [toggle, setToggle] = useRecoilState(isCalendarOpen)
  const calculateDate: number = endDate
    ? parseInt(moment(endDate).format("D")) -
      parseInt(moment(startDate).format("D"))
    : 1

  const localePrice = price.toLocaleString("ko-KR")
  const localeTotalPrice = (price * calculateDate).toLocaleString("ko-KR")
  const localeRestayCharge = (restayCharge * calculateDate).toLocaleString(
    "ko-KR",
  )
  const addTotalPrice = (calculateDate * (price + restayCharge)).toLocaleString(
    "ko-KR",
  )

  const toggleHandler = () => {
    setToggle(!toggle)
  }

  const priceInfo = (
    <div className={styles.priceInfoWrapper}>
      <div className={styles.priceInfo}>₩{localePrice} /박</div>
      <div className={styles.reviewInfoWrapper}>
        ★<span className={styles.reviewScore}>4.85</span> ·{" "}
        <span className={styles.reviewCount}>후기 4개</span>
      </div>
    </div>
  )

  return (
    <div className={styles.dataPickerContainer}>
      <div className={styles.dataPickerWrapper}>
        {endDate === null ? (
          <div>요금을 확인하려면 날짜를 입력하세요.</div>
        ) : (
          priceInfo
        )}
        <CheckIn
          startDate={startDate}
          endDate={endDate}
          onClick={toggleHandler}
        />
        {toggle && <DatePickerComponent />}
        <Button label={"예약하기"} />
        <div className={styles.reservationInfoContainer}>
          <div className={styles.reservationInfoRule}>
            예약 확정 전에는 요금이 청구되지 않습니다.
          </div>
          <div className={styles.reservationPriceContainer}>
            <div className={styles.reservationPriceWrapper}>
              <span className={styles.calculateReservationPrice}>
                ₩{localePrice} x {calculateDate}박
              </span>
              <span>₩{localeTotalPrice}</span>
            </div>
            <div className={styles.restayChargeInfoWrapper}>
              <span className={styles.restayChargeInfo}>
                Restay 서비스 수수료
              </span>
              <span>₩{localeRestayCharge}</span>
            </div>
          </div>
          <div className={styles.totalPriceWrapper}>
            <span>총 합계</span>
            <span>₩{addTotalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingsReservation
