// "use client"

// import styles from "./WishListCard.module.css"

// import { useAtomValue } from "jotai"
// import { wishListAtom } from "../../jotai/@store/state"
// import Container from "../@component/Container"
// import { useSession } from "next-auth/react"
// import Card from "./Card"
// import Empty from "../@component/Empty"

// const Content = () => {
//   const { data: session } = useSession()
//   const wishList = useAtomValue(wishListAtom)

//   const wishListData = wishList.filter((dataList) => {
//     if (session?.user) {
//       return session.user.email === dataList.email
//     }
//   })

//   return (
//     <>
//       <div className={styles.wishListContainer}>
//         {wishListData.length > 0 ? (
//           <WishListProduct wishListData={wishListData} />
//         ) : (
//           <Empty
//             title="첫 번째 위시리스트를 만들어 주세요!"
//             subtitle="하트 아이콘을 누르시고 가고싶은 숙소를 위시리스트에 저장하세요."
//             actionLabel="숙소 검색하기"
//             showReset
//           />
//         )}
//       </div>
//     </>
//   )
// }

// const WishListProduct = ({ wishListData }: any) => {
//   return (
//     <div className={styles.wishListWrapper}>
//       <div className={styles.wishListTitle}>위시리스트</div>
//       <div className={styles.listingsContainer}>
//         {wishListData.map((data: any) => {
//           return (
//             <Card
//               key={data._id}
//               userId={data._id}
//               title={data.wishListTitle}
//               data={data.favoriteData[0]}
//               disable={true}
//             />
//           )
//         })}
//       </div>
//     </div>
//   )
// }

// const WishListCard = () => {
//   return (
//     <Container>
//       <Content />
//     </Container>
//   )
// }

// export default WishListCard
