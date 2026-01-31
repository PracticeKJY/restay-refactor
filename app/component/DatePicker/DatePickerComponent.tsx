"use client";

import styles from "./DatePickerComponent.module.css";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import { endDateAtom, startDateAtom } from "../../../jotai/@store/state";
import Button from "../Button";
import Image from "next/image";
import { getMonth, getYear } from "date-fns";
import _ from "lodash";
import { useAtomValue, useSetAtom } from "jotai";

const DatePickerComponent = ({ onClick }: any) => {
  const startDate = useAtomValue(startDateAtom);
  const endDate = useAtomValue(endDateAtom);
  const setStartDate = useSetAtom(startDateAtom);
  const setEndDate = useSetAtom(endDateAtom);

  const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };
  return (
    <DatePicker
      renderCustomHeader={({ date, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => {
        const currentYears = getYear(date);
        const currentMonth = getMonth(date);

        return (
          <div className={styles.calendarHeaderWrapper}>
            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} className={styles.calendarHeaderPrevButton}>
              <Image src="/ico_arr_prev.png" alt="" width={16} height={20} />
            </button>
            <div className={styles.calendarHeaderDateInfo}>
              <span>{currentYears}</span>
              <span>년</span> <span>{months[currentMonth]}</span>
              <span>월</span>
            </div>
            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} className={styles.calendarHeaderNextButton}>
              <Image src="/ico_arr_next.png" alt="" width={16} height={20} />
            </button>
          </div>
        );
      }}
      locale={ko}
      selectsRange
      onChange={onChange}
      calendarClassName={styles.calendar} //달력커스텀
      startDate={startDate}
      endDate={endDate}
      minDate={new Date()}
      inline
    >
      <div className={styles.confirmDatePickerButton}>
        <Button label={"확인"} onClick={onClick} outline />
      </div>
    </DatePicker>
  );
};

export default DatePickerComponent;
