import styles from "./index.module.css"
import Container from "./@component/Container"
import { Suspense } from "react"
import ListingsCard from "./@component/listings/ListingsCard"
import { useAtomValue } from "jotai"
import { fetchUrlAtom } from "./@jotai/store/state"
import Loading from "./Loading"

// type Data = {
//   category: string
//   locationValue: string
//   guestCount: number
//   roomCount: number
//   bathroomCount: number
//   imageSrc: string[] | undefined
//   price: number
//   title: string
//   description: string
//   userId: any
//   createdAt: any
//   _id: any
// }

const ListingCard = () => {
  const axiosAtom = useAtomValue(fetchUrlAtom)
  return (
    <div className={styles.listingsContainer}>
      {axiosAtom.map((data: any) => {
        return <ListingsCard key={data._id} userId={data._id} data={data} />
      })}
    </div>
  )
}

export default function Home() {
  return (
    <>
      <Suspense fallback={<Loading />}>
        <Container>
          <ListingCard />
        </Container>
      </Suspense>
    </>
  )
}
