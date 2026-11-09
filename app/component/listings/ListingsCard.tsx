"use client";

import { FC } from "react";
import styles from "./ListingsCard.module.css";

import ListingCardMedia from "./ListingCardMedia";
import CardInfo from "./CardInfo";
import type { ListingCardSummary } from "@/types/listing-card";

interface ListingsCardProps {
  data: ListingCardSummary;
  userId: string;
  wishList?: boolean;
  sessionEmail?: string;
  priority?: boolean;
}

const ListingsCard: FC<ListingsCardProps> = ({ data, sessionEmail, priority }) => {
  return (
    <ListingCardMedia className={styles.listingsWrapper} data={data} sessionEmail={sessionEmail} priority={priority}>
      <CardInfo data={data} />
    </ListingCardMedia>
  );
};

export default ListingsCard;
