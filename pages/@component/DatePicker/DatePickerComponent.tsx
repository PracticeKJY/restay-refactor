"use client"

import styles from "./DatePickerComponent.module.css"
import DatePicker from "react-datepicker"
import { ko } from "date-fns/locale"
import { useRecoilState } from "recoil"
import {
  isCalendarOpen,
  useEndDate,
  useStartDate,
} from "@/pages/@recoil/store/state"
import Button from "../Button"
import Image from "next/image"
import { getMonth, getYear } from "date-fns"
import _ from "lodash"
import { useState } from "react"

const DatePickerComponent = () => {
  const [startDate, setStartDate] = useRecoilState(useStartDate)
  const [endDate, setEndDate] = useRecoilState(useEndDate)
  const [toggle, setToggle] = useRecoilState(isCalendarOpen)

  const years = _.range(2023, getYear(new Date()) + 1, 1)
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ]

  const onChange = (dates: any) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const toggleHandler = () => {
    setToggle(!toggle)
  }

  return (
    <DatePicker
      renderCustomHeader={({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className={styles.calendarHeaderWrapper}>
          <button
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className={styles.calendarHeaderPrevButton}
          >
            <Image src="/ico_arr_prev.png" alt="" width={16} height={20} />
          </button>
          <div className={styles.calendarHeaderDateInfo}>
            <span>{years}</span>
            <span>년</span> <span>{months[getMonth(date)]}</span>
            <span>월</span>
          </div>
          <button
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className={styles.calendarHeaderNextButton}
          >
            <Image src="/ico_arr_next.png" alt="" width={16} height={20} />
          </button>
        </div>
      )}
      locale={ko}
      selectsRange
      onChange={onChange}
      calendarClassName={styles.calendar} //달력커스텀
      showPopperArrow={false}
      startDate={startDate}
      endDate={endDate}
      minDate={new Date()}
      inline
    >
      <div className={styles.confirmDatePickerButton}>
        <Button label={"확인"} onClick={toggleHandler} outline />
      </div>
    </DatePicker>
  )
}

export default DatePickerComponent
