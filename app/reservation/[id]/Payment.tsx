"use client";

import styles from "./Reservation.module.css";

import Image from "next/image";
import { useState } from "react";
import paymentOptionData from "../../../localData/paymentOptionData";
import ReservationInput from "./ReservationInput";
import PaymentDropDownHeader from "@/app/reservation/components/PaymentDropDownHeader";
import PaymentDropDownList from "@/app/reservation/components/PaymentDropDownList";
import { useSetAtom } from "jotai";
import { paymentTypeAtom } from "@/jotai/@store/state";
import DropDown from "@/app/@component/DropDown/DropDown";

interface PaymentProps {
  type: "creditCard" | "kakaoPay" | "tossPayments";
}

const Payment = ({ type }: PaymentProps) => {
  const paymentOptions = paymentOptionData;

  // const setType = useSetAtom(paymentTypeAtom);

  const [isCheck, setIsCheck] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [formattedValue, setFormattedValue] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    let formatted = "";
    for (let i = 0; i < value.length; i += 4) {
      const chunk = value.substring(i, i + 4);
      if (chunk) formatted += `${chunk} `;
    }
    setInputValue(value);
    setFormattedValue(formatted.trim());
  };

  return (
    <div className={styles.paymentContainer}>
      <div className={styles.paymentTitleWrapper}>
        <div className={styles.paymentTitle}>결제 수단</div>
        <div className={styles.creditImageWrapper}>
          <Image src={"/ic-logo-visa.svg"} alt="" width={36} height={36} />
          <Image src={"/ic-logo-amex.svg"} alt="" width={36} height={36} />
          <Image src={"/ic-logo-master.svg"} alt="" width={36} height={36} />
        </div>
      </div>
      <div className={styles.paymentOptionContainer}>
        <div className={styles.paymentOptionDropDown}>
          <DropDown />
          <PaymentDropDownHeader isCheck={isCheck} setIsCheck={setIsCheck} />
          <PaymentDropDownList paymentOptions={paymentOptions} isCheck={isCheck} setIsCheck={setIsCheck} />
        </div>
        <div className={styles.paymentOptionInfo}>
          <ReservationInput
            title={"카드번호"}
            id={"creditCardNumber"}
            maxLength={19}
            value={formattedValue || inputValue}
            onChange={handleInputChange}
            placeholder={"0000 0000 0000 0000"}
          />
          <div className={styles.expirationAndCVVWrapper}>
            <ReservationInput title={"만료일"} id={"expirationDate"} placeholder={"MM / YY"} />
            <ReservationInput title={"CVV"} id={"CVV"} placeholder={"123"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
