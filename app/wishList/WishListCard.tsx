"use client";

import styles from "./WishListCard.module.css";
import Card from "./Card";
import Empty from "../@component/Empty";
import { useEffect, useState } from "react";
import { GET } from "@/app/@http/request";
import Spinner from "@/app/@component/Spinner/Spinner";

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

const WishListCard = () => {
  const [wishList, setWishList] = useState<WishListProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getFavoriteList = async () => {
      try {
        setIsLoading(true);
        const res = await GET<WishListProps[]>("/api/favorite/findFavorite");
        setWishList(res.data);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };

    getFavoriteList();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styles.wishListContainer}>
      {wishList?.length > 0 ? (
        <WishListProduct wishListData={wishList} />
      ) : (
        <Empty title="첫 번째 위시리스트를 만들어 주세요!" subtitle="하트 아이콘을 누르시고 가고싶은 숙소를 위시리스트에 저장하세요." actionLabel="숙소 검색하기" showReset />
      )}
    </div>
  );
};

const WishListProduct = ({ wishListData }: { wishListData: WishListProps[] }) => {
  return (
    <div className={styles.wishListWrapper}>
      <div className={styles.wishListTitle}>위시리스트</div>
      <div className={styles.listingsContainer}>
        {wishListData.map((data: WishListProps) => (
          <Card key={data._id} userId={data._id} title={data.wishListTitle} data={data.listing} disable={true} />
        ))}
      </div>
    </div>
  );
};

export default WishListCard;
