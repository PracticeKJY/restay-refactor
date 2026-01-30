"use client";

import { paymentTypeAtom } from "@/jotai/@store/state";
import { useAtom, useSetAtom } from "jotai";
import { FC, useState } from "react";
import styles from "../[id]/Reservation.module.css";
import { IconType } from "react-icons";
import { PAYMENT_CONFIG, PaymentType } from "@/lib/portone-v1";
import PaymentOption from "@/app/reservation/components/PaymentOption";

interface PaymentDropDownProps {
  paymentOptions: {
    label: string;
    icon: IconType;
  }[];
  isCheck: boolean;
  setIsCheck: (isCheck: boolean) => void;
}

const PaymentDropDownList: FC<PaymentDropDownProps> = ({ paymentOptions, isCheck = false, setIsCheck }) => {
  const [type, setType] = useAtom(paymentTypeAtom);

  const PAYMENT_TYPES = Object.keys(PAYMENT_CONFIG) as PaymentType[];

  return (
    <div className={styles.dropdownContent} style={{ display: isCheck ? "block" : "none" }}>
      <ul>
        {PAYMENT_TYPES.map((typeKey, index) => {
          const cfg = PAYMENT_CONFIG[typeKey];

          return (
            <li key={index}>
              <PaymentOption
                key={index}
                label={cfg.displayName}
                icon={cfg.icon}
                onClick={() => {
                  setType(typeKey);
                  setIsCheck(false);
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
