"use client";

import styles from "../[id]/Reservation.module.css";
import { FC } from "react";
import Image, { StaticImageData } from "next/image";

interface paymentOptionProps {
  label: string;
  icon: StaticImageData;
  onClick?: () => void;
}

const PaymentOption: FC<paymentOptionProps> = ({ icon: Icon, label, onClick }) => {
  return (
    <>
      <div className={styles.paymentOptionListWrapper} onClick={onClick}>
        <div className={styles.paymentOptionList}>
          <div
            style={{
              position: "relative",
              width: "30px",
              height: "30px",
            }}>
            <Image
              src={Icon}
              alt={label}
              fill
              sizes="full"
              style={{
                objectFit: "contain",
              }}
            />
          </div>
          <span>{label}</span>
        </div>
      </div>
    </>
  );
};

export default PaymentOption;
