"use client"

import styles from "./WishListCard.module.css"

import { useAtomValue } from "jotai"
import { Suspense } from "react"
import { wishListAtom } from "../@jotai/store/state"
import Container from "../@component/Container"
import ListingsCard from "../@component/listings/ListingsCard"
import { useSession } from "next-auth/react"

const Content = () => {
  const { data: session } = useSession()
  const wishList = useAtomValue(wishListAtom)

  const wishListData = wishList.filter((dataList) => {
    if (session?.user) {
      return session.user.email === dataList.email
    }
  })

  return (
    <div className={styles.listingsContainer}>
      {wishListData.map((data: any) => {
        return (
          <ListingsCard
            key={data._id}
            userId={data._id}
            data={data.favoriteData[0]}
            wishList={true}
          />
        )
      })}
    </div>
  )
}

const WishListCard = () => {
  return (
    <Container>
      <Suspense fallback={<div>로딩중...</div>}>
        <Content />
      </Suspense>
    </Container>
  )
}

export default WishListCard
