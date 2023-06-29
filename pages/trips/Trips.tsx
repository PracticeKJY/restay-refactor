"use client"

import { useAtomValue } from "jotai"
import styles from "./Trips.module.css"
import { reservationProductAtom } from "../../jotai/@store/state"
import { useSession } from "next-auth/react"
import { Suspense } from "react"
import Container from "../@component/Container"
import Card from "../wishList/Card"
import Empty from "../@component/Empty"

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
        {reservationProductFilter.length > 0 ? (
          <ReservationProduct
            reservationProductFilter={reservationProductFilter}
          />
        ) : (
          <Empty
            title="아직 예약된 여행이 없습니다!"
            subtitle="Restay와 함께 여행 계획을 세워보세요."
            actionLabel="숙소 검색하기"
            showReset
          />
        )}
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

const ReservationProduct = ({ reservationProductFilter }: any) => {
  return (
    <div className={styles.tripsWrapper}>
      <div className={styles.tripsTitle}>예약확정내역</div>
      <div className={styles.listingsContainer}>
        {reservationProductFilter.map((data: any, index: any) => {
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
  )
}
