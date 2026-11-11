"use client";
import { useTranslations } from "next-intl";


import styles from "./SwiperComponent.module.css";

import { useRouter } from "@/i18n/navigation";
import Image from "@/app/component/Skeleton/ProgressiveImage";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Swiper as SwiperType, Navigation } from "swiper";
import { FC, useRef } from "react";
import type { ListingCardMediaData } from "@/types/listing-card";

import "swiper/css";
import "swiper/css/navigation";
import FavoriteButton from "./FavoriteButton";

interface SwiperComponentProps {
  data: ListingCardMediaData;
  isHover: boolean;
  disable?: boolean;
  sessionEmail?: string;
  priority?: boolean;
}

const SwiperComponent: FC<SwiperComponentProps> = ({ data, isHover, disable = false, sessionEmail, priority = false }) => {
  const t = useTranslations("Listings");
  const controls = useTranslations("Common");

  SwiperCore.use([Navigation]);

  const router = useRouter();

  const productCards = data.imageSrc.map((src, index) => {
    return (
      <SwiperSlide key={index}>
        <Image
          priority={priority && index === 0}
          alt={t("listingPhoto", { p0: index + 1 })}
          src={src}
          fill
          sizes="(max-width: 640px) calc(100vw - 16px), 300px"
          className={styles.listingsImage}
          onClick={() => {
            router.push(`/listings/${data._id}`);
          }}
          role="link"
          tabIndex={0}
          onKeyDown={(event) => { if (event.key === "Enter") router.push(`/listings/${data._id}`); }}
        />
      </SwiperSlide>
    );
  });

  const swiperRef = useRef<SwiperType>();

  return (
    <>
      <Swiper
        data-listing-media className={styles.swiper}
        modules={[Navigation]}
        loop
        slidesPerGroup={1}
        slidesPerView={1}
        spaceBetween={0}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}>
        {productCards}
      </Swiper>
      {disable ? "" : <FavoriteButton data={data} sessionEmail={sessionEmail} />}
      {/* <FavoriteButton data={data} /> */}
      <button type="button" aria-label={controls("previous")} className={`${styles.prevButton} ${isHover ? styles.visibleButton : ""}`} onClick={() => swiperRef.current?.slidePrev()}>
        {"<"}
      </button>
      <button type="button" aria-label={controls("next")} className={`${styles.nextButton} ${isHover ? styles.visibleButton : ""}`} onClick={() => swiperRef.current?.slideNext()}>
        {">"}
      </button>
    </>
  );
};

export default SwiperComponent;
