// Only the fields required by the shared card image area.
export interface ListingCardMediaData {
  _id: string;
  imageSrc: string[];
}

export interface ListingCardSummary extends ListingCardMediaData {
  title: string;
  location: string;
  category: string;
  price: number;
}
