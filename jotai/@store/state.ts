import { PaymentType } from "@/lib/portone-v1";
import paymentOptionData from "../../localData/paymentOptionData";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const nameAtom = atom("조함찌");

export const loginModalAtom = atom(false);
loginModalAtom.debugLabel = "loginModalAtom";

export const registerModalAtom = atom(false);
registerModalAtom.debugLabel = "registerModalAtom";

export const menuOpenAtom = atom(false);
menuOpenAtom.debugLabel = "menuOpenAtom";

export const rentModalAtom = atom(false);
rentModalAtom.debugLabel = "rentModalAtom";

export const wishListModalAtom = atom(false);
wishListModalAtom.debugLabel = "wishListModalAtom";

export const selectedCardAtom = atom("");
selectedCardAtom.debugLabel = "selectedCardAtom";

export interface DetailListingAtomProps {
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
  userName: string;
  userImage: string;
  latlngData: any;
  sessionEmail?: string;
}
export const DetailListingAtom = atomWithStorage<DetailListingAtomProps>("Listings", {
  category: "",
  location: "",
  guestCount: 0,
  roomCount: 0,
  bathroomCount: 0,
  imageSrc: undefined,
  price: 0,
  title: "",
  description: "",
  userId: undefined,
  createdAt: undefined,
  userName: "",
  userImage: "",
  sessionEmail: "",
  latlngData: { lat: 0, lng: 0 },
});
DetailListingAtom.debugLabel = "DetailListingAtom";

// export const favoriteAtom = atom(false)
// favoriteAtom.debugLabel = "favoriteAtom"

export const startDateAtom = atom(new Date());
startDateAtom.debugLabel = "startDateAtom";

export const endDateAtom = atom(new Date(Date.now() + 24 * 60 * 60 * 1000));
endDateAtom.debugLabel = "endDateAtom";
export const nextDateAtom = atom((get) => {
  const currentDate = get(startDateAtom);
  return new Date(currentDate.valueOf() + 24 * 60 * 60 * 1000);
});

nextDateAtom.debugLabel = "nextDateAtom";

export const calendarOpenAtom = atom(false);
calendarOpenAtom.debugLabel = "calendarOpenAtom";

export const restayChargeAtom = atom(3000);
restayChargeAtom.debugLabel = "restayChargeAtom";

// export const fetchUrlAtom = atom(async () => {
//   const response = await axios.get(
//     "http://localhost:3000/api/listings/getListings",
//   )
//   const data = response.data
//   return data
// })

export interface fetchUrlatomProps {
  title: string;
  description: string;
  imageSrc: string[];
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  location: string;
  price: number;
  userId: string;
  createdAt: string;
  latlngData: any;
}

export const fetchUrlAtom = atom<fetchUrlatomProps[]>([]);
fetchUrlAtom.debugLabel = "fetchUrlAtom";

export const localStorageDataAtom = atom([]);
localStorageDataAtom.debugLabel = "localStorageDataAtom";

// 해야할거 2중 db 슥슥이 favorite에서 데이터 받아온뒤,
//  listing에서 데이터 찾고, 그걸 상태에저장.
// export const wishListAtom = atom(async () => {
//   const response = await axios.get(
//     "http://localhost:3000/api/favorite/findFavorite",
//   )
//   const data = await response.data
//   return data
// })

export interface wishListAtomProps {
  email?: string;
  _id?: string;
  id?: string;
  listingsId?: string;
  wishListTitle?: string;
  favoriteData?: any;
}

export const wishListAtom = atomWithStorage<wishListAtomProps[]>("wishListAtom", []);
wishListAtom.debugLabel = "wishListAtom";

// export const favoriteDataAtom = atom((get) => {
//   const wishList = get(wishListAtom)
//   return wishList.map((data) => {
//     return data.favoriteData
//   })
// })
// favoriteDataAtom.debugLabel = "favoriteDataAtom"

export interface favoriteAtomProps {
  email: string;
  id: string;
}

export const favoriteAtom = atomWithStorage<favoriteAtomProps[]>("favoriteAtom", []);
favoriteAtom.debugLabel = "favoriteAtom";

export const duplicateFavoriteDataAtom = atom((get) => {
  const wishList = get(wishListAtom);
  return wishList.filter((data: any, index: number) => {
    const i = wishList.findIndex((value: any) => value.id === data.id);
    return i === index;
  });
});
duplicateFavoriteDataAtom.debugLabel = "duplicateFavoriteDataAtom";

export const paymentOptionAtom = atom(paymentOptionData[0]);
paymentOptionAtom.debugLabel = "paymentOptionAtom";

export interface reservationProductAtomProps {
  email: string | undefined | null;
  product: any;
  startDay: string;
  endDay: string;
}

export const reservationProductAtom = atomWithStorage<reservationProductAtomProps[]>("reservationProduct", []);
reservationProductAtom.debugLabel = "reservationProductAtom";

interface latlngAtomProps {
  lat: number;
  lng: number;
}

export const latlngAtom = atom<latlngAtomProps>({ lat: 0, lng: 0 });
latlngAtom.debugLabel = "latlngAtom";

export const paymentTypeAtom = atom<PaymentType>("mobilians_card");
