import { atom } from "jotai"

export const nameAtom = atom("조함찌")

export const loginModalAtom = atom(false)
export const registerModalAtom = atom(false)
export const menuOpenAtom = atom(false)
export const rentModalAtom = atom(false)

export const favoriteAtom = atom(false)
export const startDateAtom = atom(new Date())

export const endDateAtom = atom(null)
export const calendarOpenAtom = atom(false)
export const restayChargeAtom = atom(3000)
