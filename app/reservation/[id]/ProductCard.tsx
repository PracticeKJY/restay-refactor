"use client";

import Skeleton from "@/app/@component/Skeleton/Skeleton";
import styles from "./Reservation.module.css";
import Image from "next/image";
import { FcPlanner } from "react-icons/fc";

const ProductCardInfo = ({ detailListing }: any) => {
  const imageSrc = detailListing?.imageSrc?.[0];

  return (
    <div className={styles.productInfoWrapper}>
      {imageSrc ? (
        <Image src={imageSrc} alt="reservationImg" width={124} height={106} className={styles.productImage} />
      ) : (
        <>
          <Skeleton variant="image" width={124} height={106} radius={12} />
        </>
      )}
      <div className={styles.productInfo}>
        <div>
          <div className={styles.categoryInfo}>
            <span>{detailListing.category}</span>
          </div>
          <div className={styles.titleInfo}>
            <div className={styles.fcPlanner}>
              <FcPlanner size={14} />
            </div>
            {detailListing.title}
          </div>
        </div>
        <div className={styles.reviewInfoWrapper}>
          ★<span className={styles.reviewScore}>4.85</span>(후기 4개)
        </div>
      </div>
    </div>
  );
};

export default ProductCardInfo;
