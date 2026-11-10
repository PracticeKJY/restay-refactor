"use client";

import { useState, type ReactNode } from "react";
import type { ListingCardMediaData } from "@/types/listing-card";
import SwiperComponent from "./SwiperComponent";

interface ListingCardMediaProps {
  data: ListingCardMediaData;
  className: string;
  disable?: boolean;
  sessionEmail?: string;
  priority?: boolean;
  children?: ReactNode;
}

export default function ListingCardMedia({ data, className, disable, sessionEmail, priority, children }: ListingCardMediaProps) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div data-listing-card className={className} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
      <SwiperComponent data={data} isHover={isHover} disable={disable} sessionEmail={sessionEmail} priority={priority} />
      {children}
    </div>
  );
}
