"use client"

import styles from "./Reservation.module.css"

import Image from "next/image"
import { FaAngleDown } from "react-icons/fa"
import { FC, useState } from "react"
import { useAtom, useAtomValue } from "jotai"
import { paymentOptionAtom } from "../../../jotai/@store/state"
import paymentOptionData from "../../../localData/paymentOptionData"
import ReservationInput from "./ReservationInput"
import PaymentOption from "./PaymentOption"
import { IconType } from "react-icons"

const Payment = () => {
  const paymentOptions = paymentOptionData
  const [inputValue, setInputValue] = useState("")
  const [formattedValue, setFormattedValue] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")

    let formatted = ""
    for (let i = 0; i < value.length; i += 4) {
      const chunk = value.substring(i, i + 4)
      if (chunk) formatted += `${chunk} `
    }
    setInputValue(value)
    setFormattedValue(formatted.trim())
  }

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
          <PaymentDropDownHeader />
          <PaymentDropDownList paymentOptions={paymentOptions} />
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
            <ReservationInput
              title={"만료일"}
              id={"expirationDate"}
              placeholder={"MM / YY"}
            />
            <ReservationInput title={"CVV"} id={"CVV"} placeholder={"123"} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Payment

//PaymentDropDownHeader component
const PaymentDropDownHeader = () => {
  const paymentOption = useAtomValue(paymentOptionAtom)
  return (
    <>
      <input id="dropdown" type="checkbox" />
      <label className={styles.dropdownLabel} htmlFor="dropdown">
        <div className={styles.paymentOptionText}>
          <PaymentOption
            icon={paymentOption.icon}
            label={paymentOption.label}
            isCheck={false}
          />
        </div>
        <FaAngleDown className={styles.dropDownIcon} />
      </label>
    </>
  )
}

//PaymentDropDownList Component

interface PaymentDropDownProps {
  paymentOptions: {
    label: string
    icon: IconType
  }[]
}

const PaymentDropDownList: FC<PaymentDropDownProps> = ({ paymentOptions }) => {
  const [paymentOption, setPaymentOption] = useAtom(paymentOptionAtom)
  const [isCheck, setIsCheck] = useState(false)

  return (
    <div className={styles.dropdownContent}>
      <ul>
        {paymentOptions.map((option, index) => {
          return (
            <li key={index}>
              <PaymentOption
                key={index}
                label={option.label}
                icon={option.icon}
                isCheck={isCheck}
                onClick={() => {
                  setPaymentOption({
                    label: option.label,
                    icon: option.icon,
                  })
                  setIsCheck(true)
                }}
              />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
