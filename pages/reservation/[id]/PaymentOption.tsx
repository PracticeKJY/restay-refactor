"use client"

import styles from "./Reservation.module.css"
import { FC } from "react"
import { IconType } from "react-icons"
import { useAtomValue } from "jotai"
import { paymentOptionAtom } from "@/pages/@jotai/store/state"
import { AiOutlineCheck } from "react-icons/ai"

interface paymentOptionProps {
  label: string
  icon: IconType
  isCheck?: boolean
  onClick?: () => void
}

const PaymentOption: FC<paymentOptionProps> = ({
  icon: Icon,
  label,
  isCheck,
  onClick,
}) => {
  const paymentOption = useAtomValue(paymentOptionAtom)

  return (
    <>
      <div className={styles.paymentOptionListWrapper} onClick={onClick}>
        <div className={styles.paymentOptionList}>
          <Icon size={30} />
          <span>{label}</span>
        </div>
        {isCheck && paymentOption.label === label ? (
          <AiOutlineCheck size={20} />
        ) : (
          ""
        )}
      </div>
    </>
  )
}

export default PaymentOption
