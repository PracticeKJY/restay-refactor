"use client";

import styles from "./ListingsInfo.module.css";
import { FC, useState } from "react";
import { categories } from "../Header/Categories";
import ListingCategory from "./ListingCategory";
import Avatar from "../Header/Avatar";

interface ListingsInfoProps {
  listingData: {
    category: string;
    location: string;
    guestCount: number;
    roomCount: number;
    bathroomCount: number;
    imageSrc: string[] | undefined;
    price: number;
    title: string;
    description: string;
    userId: any;
    createdAt: any;
    userName: string;
    userImage: string;
    latlngData: any;
  };
}

const ListingsInfo: FC<ListingsInfoProps> = ({ listingData }) => {
  const [isMore, setIsMore] = useState(false);

  const findCategory = categories.filter((item) => {
    return item.label === listingData.category;
  });

  return (
    <>
      <div className={styles.hostDataContainer}>
        <div className={styles.hostingInfoContainer}>
          <div className={styles.hostingInfoWrapper}>
            <h2 className={styles.hostingIntroduce}>{listingData.userName} 님이 호스팅하는 숙소</h2>
            <ol className={styles.countList}>
              <li>{`최대 인원 ${listingData.guestCount}명`}</li>
              <li>{`방 ${listingData.roomCount}개`}</li>
              <li>{`욕실 ${listingData.bathroomCount}개`}</li>
            </ol>
          </div>
          <Avatar accountImage={listingData.userImage} width={60} height={60} />
        </div>

        <div className={styles.locationInfo}>
          {findCategory && <ListingCategory icon={findCategory[0].icon} label={findCategory[0]?.label} description={findCategory[0]?.description} />}
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
                <span className={styles.moreDescriptionText}>{!isMore ? "더 보기" : "접기"}</span>
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
