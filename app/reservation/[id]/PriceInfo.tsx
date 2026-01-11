"use client"

import { restayChargeAtom } from "../../../jotai/@store/state"
import styles from "./Reservation.module.css"
import { useAtomValue } from "jotai"
import moment from "moment"
import { FC } from "react"

interface PriceInfoProps {
  price: number
  startDate: Date
  endDate: Date
}

const PriceInfo: FC<PriceInfoProps> = ({ price, startDate, endDate }) => {
  const calculateDate = moment(endDate).diff(moment(startDate), "days")
  const localePrice = price.toLocaleString("ko-KR")
  const 변수 = price * calculateDate
  const 변수를3자리수마다나눈거 = 변수.toLocaleString("ko-KR")
  const restayCharge = useAtomValue(restayChargeAtom)
  const localeRestayCharge = (restayCharge * calculateDate).toLocaleString(
    "ko-KR",
  )
  const addTotalPrice = (calculateDate * (price + restayCharge)).toLocaleString(
    "ko-KR",
  )

  return (
    <>
      <div className={styles.priceInfoWrapper}>
        <div className={styles.calculatePriceWrapper}>
          <div>
            ₩{localePrice} x {calculateDate}박
          </div>
          <div>₩{변수를3자리수마다나눈거}</div>
        </div>
        <div className={styles.calculatePriceWrapper}>
          <span className={styles.restayCharge}>Restay 서비스 수수료</span>
          <span>₩{localeRestayCharge}</span>
        </div>
      </div>
      <div className={styles.totalPriceWrapper}>
        <span>총 합계</span>
        <span>₩{addTotalPrice}</span>
      </div>
      <div className={styles.cautionText}>
        해외에서 결제가 처리되기 때문에 카드 발행사에서 추가 수수료를 부과할 수
        있습니다.
      </div>
    </>
  )
}

export default PriceInfo
