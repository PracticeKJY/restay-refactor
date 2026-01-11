// "use client"

// import styles from "./Reservation.module.css"

// import Container from "@/pages/@component/Container"
// import { useRouter } from "next/router"
// import Info from "./Info"
// import Payment from "./Payment"
// import Refund from "./Refund"
// import Rule from "./Rule"
// import ProductCardInfo from "./ProductCard"
// import {
//   DetailListingAtom,
//   endDateAtom,
//   nextDateAtom,
//   reservationProductAtom,
//   startDateAtom,
// } from "../../../jotai/@store/state"
// import { useAtom, useAtomValue } from "jotai"
// import PriceInfo from "./PriceInfo"
// import Button from "@/pages/@component/Button"
// import axios from "axios"
// import toast from "react-hot-toast"
// import moment from "moment"
// import { useSession } from "next-auth/react"

// const Reservation = () => {
//   const { data: session } = useSession()
//   const router = useRouter()
//   const { id } = router.query
//   const detailListing = useAtomValue(DetailListingAtom)
//   const startDate = useAtomValue(startDateAtom)
//   const endDate = useAtomValue(endDateAtom)
//   const nextDate = useAtomValue(nextDateAtom)

//   const apiStartDay = moment(startDate).format("M.D")
//   const apiEndDay = moment(endDate).format("M.D")

//   const [reservationProduct, setReservationProduct] = useAtom(
//     reservationProductAtom,
//   )

//   const onClick = async () => {
//     try {
//       const modifyFormData = {
//         email: session?.user?.email,
//         product: detailListing,
//         startDay: apiStartDay,
//         endDay: apiEndDay,
//       }
//       await axios.post("/api/reservation/reservation", modifyFormData)
//       setReservationProduct((prevData) => {
//         return [...prevData, modifyFormData]
//       })
//       toast.success("예약되었습니다.")
//       router.push("/")
//     } catch (e) {
//       toast.error("예약에 실패했어요.")
//     }
//   }

//   return (
//     <>
//       <Container>
//         <div className={styles.reservationContainer}>
//           <div className={styles.reservationInfo}>
//             <div className={styles.title}>예약 요청</div>
//             <Info
//               startDate={startDate}
//               endDate={endDate ? endDate : nextDate}
//             />
//             <Payment />
//             <Refund />
//             <Rule />
//             <Button label={"예약 요청"} onClick={onClick} />
//           </div>
//           <div className={styles.productCardContainer}>
//             <div className={styles.productCardWrapper}>
//               <ProductCardInfo detailListing={detailListing} />
//               <div className={styles.priceInfoHeading}>요금세부정보</div>
//               <PriceInfo
//                 price={detailListing.price}
//                 startDate={startDate}
//                 endDate={endDate ? endDate : nextDate}
//               />
//             </div>
//           </div>
//         </div>
//       </Container>
//     </>
//   )
// }

// export default Reservation
