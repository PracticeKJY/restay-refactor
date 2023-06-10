"use client"

import { atom } from "recoil"

export const nameAtom = atom({
  key: "nameAtom",
  default: "조함찌",
})

export const useLoginModal = atom({
  key: "useLoginModal",
  default: false,
})
export const useRegisterModal = atom({
  key: "useRegisterModal",
  default: false,
})
export const useMenuOpen = atom({
  key: "useMenuOpen",
  default: false,
})
export const useRentModal = atom({
  key: "useRentModal",
  default: false,
})

export const hasFavoriteAtom = atom({
  key: "hasFavoriteAtom",
  default: false,
})
export const useStartDate = atom({
  key: "useStartDate",
  default: new Date(),
})
export const useEndDate = atom({
  key: "useEndDate",
  default: null,
})
export const isCalendarOpen = atom({
  key: "isCalendarOpen",
  default: false,
})
export const restayChargeAtom = atom({
  key: "restayChargeAtom",
  default: 3000,
})
