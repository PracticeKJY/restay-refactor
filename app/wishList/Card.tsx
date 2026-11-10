"use client";
import { useTranslations } from "next-intl";


import styles from "./Card.module.css";
import ListingCardMedia from "../component/listings/ListingCardMedia";
import { FC } from "react";
import type { ListingCardMediaData } from "@/types/listing-card";

interface CardProps {
  data: ListingCardMediaData;
  userId?: string;
  title?: string;
  startDay?: string;
  endDay?: string;
  disable?: boolean;
  location?: string;
  description?: string;
}

const Card: FC<CardProps> = ({ data, title, startDay, endDay, disable, location, description }) => {
  const t = useTranslations("Common");

  return (
    <>
      <div className={styles.cardContainer}>
        <div className={styles.cardWrapper}>
          <ListingCardMedia className={styles.listingsWrapper} data={data} disable={disable} />
          {title ? (
            <div className={styles.cardTitle}>{title}</div>
          ) : (
            <div className={styles.cardTitle}>
              {t("reservationDates")} {startDay} ~ {endDay}
            </div>
          )}
          {location && <p className={styles.cardLocation}>{location.split(" ").slice(0, 2).join(" ")}</p>}
          {description && <p className={styles.cardDescription}>{description}</p>}
        </div>
      </div>
    </>
  );
};

export default Card;
