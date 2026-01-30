"use client";

import { paymentTypeAtom } from "@/jotai/@store/state";
import styles from "../[id]/Reservation.module.css";
import { useAtomValue } from "jotai";
import { FaAngleDown } from "react-icons/fa";
import { PAYMENT_CONFIG } from "@/lib/portone-v1";
import PaymentOption from "@/app/reservation/components/PaymentOption";

interface PaymentDropDownHeaderProps {
  isCheck: boolean;
  setIsCheck: (isCheck: boolean) => void;
}

const PaymentDropDownHeader = ({ isCheck, setIsCheck }: PaymentDropDownHeaderProps) => {
  const paymentType = useAtomValue(paymentTypeAtom);
  const paymentOption = PAYMENT_CONFIG[paymentType];

  return (
    <div
      className={styles.dropdownLabel}
      onClick={() => {
        setIsCheck(!isCheck);
      }}>
      <div className={styles.paymentOptionText}>
        <PaymentOption icon={paymentOption.icon} label={paymentOption.displayName} isCheck={isCheck} />
      </div>
      <FaAngleDown
        className={styles.dropDownIcon}
        style={{
          transform: isCheck ? "rotate(-180deg)" : "rotate(0deg)",
        }}
      />
    </div>
  );
};

export default PaymentDropDownHeader;
