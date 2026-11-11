"use client";
import { useLocale, useTranslations } from "next-intl";


import styles from "./WishListCard.module.css";
import Card from "./Card";
import Empty from "../component/Empty";
import { useEffect, useState } from "react";
import { GET } from "@/app/http/request";
import { CardSkeletons } from "@/app/component/Skeleton/PageSkeleton";
import PageShell from "@/app/component/PageShell";
import { FiHeart, FiAlertCircle } from "react-icons/fi";

export interface WishListProps {
  _id: string;
  id: string;
  wishListTitle: string;
  listing: Listing;
}

export interface Listing {
  _id: string;
  title: string;
  description: string;
  imageSrc: string[];
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  price: number;
  userId: string;
  createdAt: string;
  latlngData: {
    lat: string;
    lng: string;
  };
  location: string;
  userImage: string;
  userName: string;
}

const WishListCard = ({ sessionEmail }: { sessionEmail?: string }) => {
  const design = useTranslations("WorkspaceDesign");
  const locale = useLocale();
  const t = useTranslations("Common");

  const [wishList, setWishList] = useState<WishListProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!sessionEmail) { setIsLoading(false); return; }
    let active = true;
    const getFavoriteList = async () => {
      try {
        setIsLoading(true);
        setFailed(false);
        const res = await GET<WishListProps[]>("/api/favorite/findFavorite");
        if (active) setWishList(res.data);
      } catch (e) {
        if (active) setFailed(true);
      } finally {
        if (active) setIsLoading(false);
      }
    };

    void getFavoriteList();
    return () => { active = false; };
  }, [sessionEmail, attempt]);

  return <PageShell eyebrow={design("wishlistEyebrow")} title={design("wishlistTitle")} description={design("wishlistDescription")}
    count={sessionEmail && !isLoading && !failed ? design("savedCount", { count: wishList.length.toLocaleString(locale) }) : undefined}>
    <div className={styles.wishListContainer}>
      {!sessionEmail ? <Empty title={t("pleaseLogIn")} subtitle={design("wishlistLoginDescription")} actionLabel={t("logIn")} action="login" showReset icon={<FiHeart size={30} />} /> :
       isLoading ? <CardSkeletons /> :
       failed ? <Empty title={t("errorTitle")} subtitle={design("wishlistLoadFailed")} actionLabel={t("retry")} onAction={() => setAttempt(value => value + 1)} showReset icon={<FiAlertCircle size={30} />} /> :
       wishList.length > 0 ? <WishListProduct wishListData={wishList} /> :
       <Empty title={t("createYourFirstWishlist")} subtitle={t("tapTheHeartToSavePlacesYou")} actionLabel={t("findAStay")} showReset icon={<FiHeart size={30} />} />}
    </div>
  </PageShell>;
};

const WishListProduct = ({ wishListData }: { wishListData: WishListProps[] }) => {
  return (
    <div className={styles.wishListWrapper}>

      <div className={styles.listingsContainer}>
        {wishListData.map((data: WishListProps) => (
          <Card key={data._id} userId={data._id} title={data.wishListTitle} data={data.listing} location={data.listing.location} description={data.listing.title} disable={true} />
        ))}
      </div>
    </div>
  );
};

export default WishListCard;
