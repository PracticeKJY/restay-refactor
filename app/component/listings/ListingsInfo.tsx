"use client";
import type { DetailListingAtomProps } from "@/jotai/@store/state";

import { useTranslations } from "next-intl";


import styles from "./ListingsInfo.module.css";
import { FC, useState } from "react";
import { categories } from "../Header/Categories";
import ListingCategory from "./ListingCategory";
import Avatar from "../Header/Avatar";
import { useCategoryCopy } from "@/i18n/useCategoryCopy";

interface ListingsInfoProps {
  listingData: DetailListingAtomProps;
}

const ListingsInfo: FC<ListingsInfoProps> = ({ listingData }) => {
  const t = useTranslations("Listings");
  const categoryCopy = useCategoryCopy();

  const [isMore, setIsMore] = useState(false);

  const findCategory = categories.filter((item) => {
    return item.label === listingData.category;
  });

  return (
    <>
      <div className={styles.hostDataContainer}>
        <div className={styles.hostingInfoContainer}>
          <div className={styles.hostingInfoWrapper}>
            <h2 className={styles.hostingIntroduce}>{listingData.userName}  {t("isYourHost")}</h2>
            <ol className={styles.countList}>
              <li>{t("upToGuests", { p0: listingData.guestCount })}</li>
              <li>{t("rooms", { p0: listingData.roomCount })}</li>
              <li>{t("bathrooms", { p0: listingData.bathroomCount })}</li>
            </ol>
          </div>
          <Avatar accountImage={listingData.userImage} width={60} height={60} />
        </div>

        <div className={styles.locationInfo}>
          {findCategory && <ListingCategory icon={findCategory[0].icon} label={categoryCopy(findCategory[0]?.label)} description={categoryCopy(findCategory[0]?.label, true)} />}
        </div>
        <div className={styles.descriptionWrapper}>
          <div className={styles.descriptionInfoWrapper}>
            <div className={`${!isMore ? styles.descriptionInfo : styles.descriptionInfoMore}`}>{listingData.description}</div>
            <div className={styles.moreDescription}>
              <button
                className={styles.moreDescriptionButton}
                onClick={() => {
                  setIsMore(!isMore);
                }}>
                <span className={styles.moreDescriptionText}>{!isMore ? t("showMore") : t("showLess")}</span>
                <span>{">"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingsInfo;
