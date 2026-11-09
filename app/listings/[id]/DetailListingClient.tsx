"use client";

import { FC, useEffect } from "react";
import DetailListingPage from "./DetailListingPage";
import { notFound } from "next/navigation";
import { useSetAtom } from "jotai";
import { DetailListingAtom, type DetailListingAtomProps } from "@/jotai/@store/state";

interface DetailListingClientProps {
  sessionEmail?: string;
  listingData: DetailListingAtomProps;
}

const DetailListingClient: FC<DetailListingClientProps> = ({ sessionEmail, listingData }) => {
  const setDetailListing = useSetAtom(DetailListingAtom);

  useEffect(() => {
    setDetailListing(listingData);
  }, [setDetailListing, listingData]);

  if (!listingData) return notFound();

  return <DetailListingPage sessionEmail={sessionEmail} listingData={listingData} />;
};

export default DetailListingClient;
