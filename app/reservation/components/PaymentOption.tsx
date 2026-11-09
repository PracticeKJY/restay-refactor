"use client";

import styles from "../[id]/Reservation.module.css";
import { FC } from "react";
import Image, { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";

const paymentLabels: Record<string, string> = {
  "카카오페이": "kakaoPay",
  "토스페이먼츠": "tossPayments",
  "휴대폰결제(다날)": "mobileDanal",
  "카드결제(모빌리언스)": "cardMobilians",
};

interface paymentOptionProps {
  label: string;
  icon: StaticImageData;
  onClick?: () => void;
}

const PaymentOption: FC<paymentOptionProps> = ({ icon: Icon, label, onClick }) => {
  const t = useTranslations("Reservation");
  const visibleLabel = paymentLabels[label] ? t(`payments.${paymentLabels[label]}`) : label;
  return (
    <>
      <div className={styles.paymentOptionListWrapper} onClick={onClick} role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onClick(); } } : undefined}>
        <div className={styles.paymentOptionList}>
          <div
            style={{
              position: "relative",
              width: "30px",
              height: "30px",
            }}>
            <Image
              src={Icon}
              alt={visibleLabel}
              fill
              sizes="30px"
              style={{
                objectFit: "contain",
              }}
            />
          </div>
          <span>{visibleLabel}</span>
        </div>
      </div>
    </>
  );
};

export default PaymentOption;
