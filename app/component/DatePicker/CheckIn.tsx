"use client"

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
  return (
    <button className={styles.checkIn} onClick={onClick}>
      {!endDate ? (
        <DefaultCheckIn startDate={startDate} />
      ) : (
        <SelectedCheckIn startDate={startDate} endDate={endDate} />
      )}
    </button>
  )
}

export default CheckIn

const DefaultCheckIn = ({ startDate }: { startDate: Date | null }) => {
  return (
    <>
      <Image width={32} height={32} src={"/icon_cal0.png"} alt="" priority />
      <span className={styles.momentInfo}>
        <b>
          {` ${moment(startDate).format("M.D")} . ${moment(startDate)
            .add(1, "days")
            .format("M.D")}`}
        </b>{" "}
        <em>· 1박</em>
      </span>
      <Image
        className={styles.arrDown}
        width={24}
        height={24}
        src={"/ico_arr_down.png"}
        alt=""
        priority
      />
    </>
  )
}
const SelectedCheckIn = ({
  startDate,
  endDate,
}: {
  startDate: Date | null
  endDate: Date | null
}) => {
  const calculateDate: number = moment(endDate).diff(moment(startDate), "days")

  return (
    <>
      <Image width={32} height={32} src={"/icon_cal0.png"} alt="" priority />
      <span className={styles.momentInfo}>
        <b>
          {` ${moment(startDate).format("M.D")} . ${moment(endDate).format(
            "M.D",
          )}`}
        </b>{" "}
        <em>· {calculateDate}박</em>
      </span>
      <Image
        className={styles.arrDown}
        width={24}
        height={24}
        src={"/ico_arr_down.png"}
        alt=""
        priority
      />
    </>
  )
}
