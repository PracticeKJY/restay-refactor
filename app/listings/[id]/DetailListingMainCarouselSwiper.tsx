"use client";
import type { DetailListingAtomProps } from "@/jotai/@store/state";

import { useTranslations } from "next-intl";


import styles from "./DetailListingGallery.module.css";

import { FC, useRef, useState } from "react";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Swiper as SwiperType, Navigation, FreeMode, Thumbs } from "swiper";

import "swiper/css";
import "swiper/css/navigation";

interface DetailListingMainCarouselSwiperProps {
  listingData: DetailListingAtomProps;
}

const DetailListingMainCarouselSwiper: FC<DetailListingMainCarouselSwiperProps> = ({ listingData }) => {
  const t = useTranslations("Listings");
  const controls = useTranslations("Common");

  SwiperCore.use([Navigation]);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const swiperRef = useRef<SwiperType>();
  const [slideIndex, setslideIndex] = useState(0);

  const findSwiperIndexHandler = (swiper: SwiperType) => {
    setslideIndex(swiper.realIndex);
  };

  const productCards = listingData.imageSrc?.map((src, index) => {
    return (
      <SwiperSlide key={index} className={styles.mainSlide}>
        <Image fill alt={t("listingPhoto", { p0: index + 1 })} src={src} className={styles.productCards} priority={index === 0} sizes="(max-width: 640px) calc(100vw - 16px), 560px" />
      </SwiperSlide>
    );
  });
  const productCardsList = listingData.imageSrc?.map((src, index) => {
    return (
      <SwiperSlide key={index} className={`${styles.swiperSlide} ${slideIndex === index ? styles.active : ""}`}>
        <div className={styles.thumbnailFrame}>
          <Image fill alt={t("listingPhoto", { p0: index + 1 })} src={src} className={styles.productCardsListImage} sizes="(max-width: 640px) 25vw, 120px" />
        </div>
      </SwiperSlide>
    );
  });

  return (
    <div className={styles.swiperWrapper}>
      <div className={styles.mainFrame}>
      <Swiper
        className={styles.swiper}
        onSlideChange={findSwiperIndexHandler}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[FreeMode, Navigation, Thumbs]}
        loop
        slidesPerGroup={1}
        slidesPerView={1}
        spaceBetween={0}
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}>
        {productCards}
      </Swiper>
        <button type="button" aria-label={controls("previous")} className={styles.prevButton} onClick={() => swiperRef.current?.slidePrev()}>
          {"<"}
        </button>
        <button type="button" aria-label={controls("next")} className={styles.nextButton} onClick={() => swiperRef.current?.slideNext()}>
          {">"}
        </button>
      </div>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={12}
        slidesPerView={4}
        freeMode={true}
        loop
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className={styles.swiperList}>
        {productCardsList}
      </Swiper>
    </div>
  );
};

export default DetailListingMainCarouselSwiper;
