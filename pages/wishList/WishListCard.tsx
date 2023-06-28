"use client"

import styles from "./WishListCard.module.css"

import { useAtomValue } from "jotai"
import { Suspense } from "react"
import { wishListAtom } from "../../jotai/@store/state"
import Container from "../@component/Container"
import { useSession } from "next-auth/react"
import Card from "./Card"
import Loading from "../Loading"

const Content = () => {
  const { data: session } = useSession()
  const wishList = useAtomValue(wishListAtom)

  const wishListData = wishList.filter((dataList) => {
    if (session?.user) {
      return session.user.email === dataList.email
    }
  })

  return (
    <>
      <div className={styles.wishListContainer}>
        <div className={styles.wishListTitle}>위시리스트</div>
        <div className={styles.listingsContainer}>
          {wishListData.map((data: any) => {
            return (
              <Card
                key={data._id}
                userId={data._id}
                title={data.wishListTitle}
                data={data.favoriteData[0]}
                disable={true}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

const WishListCard = () => {
  return (
    <Container>
      <Content />
    </Container>
  )
}

export default WishListCard
