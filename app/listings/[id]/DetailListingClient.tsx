"use client";

import { FC } from "react";
import DetailListingPage from "./DetailListingPage";
import { notFound } from "next/navigation";

interface DetailListingClientProps {
  sessionEmail?: string;
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
    latlngData: any;
    userName: string;
    userImage: string;
    sessionEmail?: string;
  };
}

const DetailListingClient: FC<DetailListingClientProps> = ({ sessionEmail, listingData }) => {
  if (!listingData) return notFound();

  return <DetailListingPage sessionEmail={sessionEmail} listingData={listingData} />;
};

export default DetailListingClient;
