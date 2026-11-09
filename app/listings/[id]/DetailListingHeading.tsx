"use client";
import type { DetailListingAtomProps } from "@/jotai/@store/state";

import { useTranslations } from "next-intl";


import { FC } from "react";
import styles from "./DetailListingHeading.module.css";
import Heading from "@/app/component/Heading";

interface DetailListingHeadingProps {
  listingData: DetailListingAtomProps;
}

const DetailListingHeading: FC<DetailListingHeadingProps> = ({ listingData }) => {
  const t = useTranslations("Listings");

  const location = listingData.location;

  return (
    <div className={styles.infoContainer}>
      <div className={styles.headingContainer}>
        <Heading title={listingData.title} subTitle={location} />
      </div>

      <div className={styles.comment}>
        <span className={styles.commentTitle}>{t("aNoteFromYourHost")}</span>
        <div className={styles.commentBody}>{t("weHopeEveryoneWhoStaysHereEnjoys")}</div>
      </div>
    </div>
  );
};

export default DetailListingHeading;
