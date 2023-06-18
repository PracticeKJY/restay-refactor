"use client"

import styles from "./WishListCard.module.css"

import { useAtom, useAtomValue } from "jotai"
import { Suspense, useEffect } from "react"
import { wishListAtom } from "../@jotai/store/state"
import Container from "../@component/Container"
import ListingsCard from "../@component/listings/ListingsCard"
import { useSession } from "next-auth/react"
import Card from "./Card"
import axios from "axios"

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
      <Suspense fallback={<div>로딩중...</div>}>
        <Content />
      </Suspense>
    </Container>
  )
}

export default WishListCard
