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
