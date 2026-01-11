"use client";

import { FC, useState } from "react";
import styles from "./ListingsCard.module.css";

import SwiperComponent from "./SwiperComponent";
import CardInfo from "./CardInfo";

interface ListingsCardProps {
  data: any;
  userId: any;
  wishList?: boolean;
}

const ListingsCard: FC<ListingsCardProps> = ({ data }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <>
      <div className={styles.listingsWrapper} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
        <SwiperComponent data={data} isHover={isHover} />
        <CardInfo data={data} />
      </div>
    </>
  );
};

export default ListingsCard;
