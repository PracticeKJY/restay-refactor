"use client";

import { paymentOptionAtom } from "@/jotai/@store/state";
import { useAtom } from "jotai";
import { FC, useState } from "react";
import styles from "../[id]/Reservation.module.css";
import { IconType } from "react-icons";
import PaymentOption from "@/pages/reservation/[id]/PaymentOption";

interface PaymentDropDownProps {
  paymentOptions: {
    label: string;
    icon: IconType;
  }[];
}

const PaymentDropDownList: FC<PaymentDropDownProps> = ({ paymentOptions }) => {
  const [paymentOption, setPaymentOption] = useAtom(paymentOptionAtom);
  const [isCheck, setIsCheck] = useState(false);

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
                  });
                  setIsCheck(true);
                }}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PaymentDropDownList;
