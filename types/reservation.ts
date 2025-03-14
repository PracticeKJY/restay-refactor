import { ObjectId } from "mongodb";

export type ReservationProps = {
  _id: ObjectId;
  email: string;
  product: Product;
  startDay: string;
  endDay: string;
};

export type Product = {
  _id: string;
  title: string;
  description: string;
  imageSrc: string[]; // 이미지 URL 배열
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  price: number;
  userId: string;
  createdAt: string; // ISO 날짜 문자열
  latlngData: LatLng;
  location: string;
  userImage: string;
  userName: string;
};

export type LatLng = {
  lat: number;
  lng: number;
};
