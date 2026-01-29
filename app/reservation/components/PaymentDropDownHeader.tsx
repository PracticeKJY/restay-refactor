"use client";

import { paymentOptionAtom } from "@/jotai/@store/state";
import styles from "../[id]/Reservation.module.css";
import PaymentOption from "@/pages/reservation/[id]/PaymentOption";
import { useAtomValue } from "jotai";
import { FaAngleDown } from "react-icons/fa";

interface PaymentDropDownHeaderProps {}

const PaymentDropDownHeader = ({}: PaymentDropDownHeaderProps) => {
  const paymentOption = useAtomValue(paymentOptionAtom);
  return (
    <>
      <input id="dropdown" type="checkbox" />
      <label className={styles.dropdownLabel} htmlFor="dropdown">
        <div className={styles.paymentOptionText}>
          <PaymentOption icon={paymentOption.icon} label={paymentOption.label} isCheck={false} />
        </div>
        <FaAngleDown className={styles.dropDownIcon} />
      </label>
    </>
  );
};

export default PaymentDropDownHeader;
