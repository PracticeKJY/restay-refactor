"use client"

import { useAtomValue } from "jotai"
import styles from "./Trips.module.css"
import { reservationProductAtom } from "../../jotai/@store/state"
import { useSession } from "next-auth/react"
import { Suspense } from "react"
import Container from "../@component/Container"
import Loading from "../Loading"
import Card from "../wishList/Card"

const Content = () => {
  const { data: session } = useSession()
  const reservationProduct = useAtomValue(reservationProductAtom)
  const reservationProductFilter = reservationProduct.filter((dataList) => {
    if (session?.user) {
      return session.user.email === dataList.email
    }
  })

  return (
    <>
      <div className={styles.tripsContainer}>
        <div className={styles.tripsTitle}>예약확정내역</div>
        <div className={styles.listingsContainer}>
          {reservationProductFilter.map((data: any, index) => {
            return (
              <Card
                key={index}
                data={data.product}
                startDay={data.startDay}
                endDay={data.endDay}
                disable={true}
              />
            )
          })}
        </div>
      </div>
    </>
  )
}

const Trips = () => {
  return (
    <Container>
      <Content />
    </Container>
  )
}

export default Trips
