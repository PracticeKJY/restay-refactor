"use client";

import { FC, useState } from "react";
import styles from "./ListingsCard.module.css";

import SwiperComponent from "./SwiperComponent";
import CardInfo from "./CardInfo";

interface ListingsCardProps {
  data: any;
  userId: any;
  wishList?: boolean;
  sessionEmail?: string;
}

const ListingsCard: FC<ListingsCardProps> = ({ data, sessionEmail }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <>
      <div className={styles.listingsWrapper} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
        <SwiperComponent data={data} isHover={isHover} sessionEmail={sessionEmail} />
        <CardInfo data={data} />
      </div>
    </>
  );
};

export default ListingsCard;
