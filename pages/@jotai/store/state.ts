import axios from "axios"
import { atom } from "jotai"
import { atomWithStorage } from "jotai/utils"

export const nameAtom = atom("조함찌")

export const loginModalAtom = atom(false)
loginModalAtom.debugLabel = "loginModalAtom"

export const registerModalAtom = atom(false)
registerModalAtom.debugLabel = "registerModalAtom"

export const menuOpenAtom = atom(false)
menuOpenAtom.debugLabel = "menuOpenAtom"

export const rentModalAtom = atom(false)
rentModalAtom.debugLabel = "rentModalAtom"

export const wishListModalAtom = atom(false)
wishListModalAtom.debugLabel = "wishListModalAtom"

export const selectedCardAtom = atom("")
selectedCardAtom.debugLabel = "selectedCardAtom"

// export const favoriteAtom = atom(false)
// favoriteAtom.debugLabel = "favoriteAtom"

export const startDateAtom = atom(new Date())
startDateAtom.debugLabel = "startDateAtom"

export const endDateAtom = atom(null)
endDateAtom.debugLabel = "endDateAtom"

export const calendarOpenAtom = atom(false)
calendarOpenAtom.debugLabel = "calendarOpenAtom"

export const restayChargeAtom = atom(3000)
restayChargeAtom.debugLabel = "restayChargeAtom"

export const fetchUrlAtom = atom(async () => {
  const response = await axios.get(
    "http://localhost:3000/api/listings/getListings",
  )
  const data = response.data
  return data
})
fetchUrlAtom.debugLabel = "fetchUrlAtom"

export const localStorageDataAtom = atom([])
localStorageDataAtom.debugLabel = "localStorageDataAtom"

// 해야할거 2중 db 슥슥이 favorite에서 데이터 받아온뒤,
//  listing에서 데이터 찾고, 그걸 상태에저장.
// export const wishListAtom = atom(async () => {
//   const response = await axios.get(
//     "http://localhost:3000/api/favorite/findFavorite",
//   )
//   const data = await response.data
//   return data
// })

interface wishListAtomProps {
  email?: string
  _id?: string
  id?: string
  listingsId?: string
  wishListTitle?: string
  favoriteData?: any
}

export const wishListAtom = atomWithStorage<wishListAtomProps[]>(
  "wishListAtom",
  [],
)
wishListAtom.debugLabel = "wishListAtom"

// export const favoriteDataAtom = atom((get) => {
//   const wishList = get(wishListAtom)
//   return wishList.map((data) => {
//     return data.favoriteData
//   })
// })
// favoriteDataAtom.debugLabel = "favoriteDataAtom"

interface favoriteAtomProps {
  email: string
  id: string
}

export const favoriteAtom = atomWithStorage<favoriteAtomProps[]>(
  "favoriteAtom",
  [],
)
favoriteAtom.debugLabel = "favoriteAtom"

export const duplicateFavoriteDataAtom = atom((get) => {
  const wishList = get(wishListAtom)
  return wishList.filter((data: any, index: number) => {
    const i = wishList.findIndex((value: any) => value.id === data.id)
    return i === index
  })
})
duplicateFavoriteDataAtom.debugLabel = "duplicateFavoriteDataAtom"
