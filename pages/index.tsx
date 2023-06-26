import styles from "./index.module.css"
import Container from "./@component/Container"
import { Suspense, useEffect, useState } from "react"
import ListingsCard from "./@component/listings/ListingsCard"
import { useAtom, useAtomValue } from "jotai"
import { fetchUrlAtom } from "./@jotai/store/state"
import Loading from "./Loading"
import axios from "axios"
import { useRouter } from "next/router"
import Empty from "./@component/Empty"

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
  const [fetchUrl, setFetchUrl] = useAtom(fetchUrlAtom)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getListing = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/listings/getListings",
          router.query,
        )
        const data = response.data
        setFetchUrl(data)
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }
    getListing()
  }, [router.query])

  const routerQuery = router.query.category
  const searchResult = routerQuery ? (
    <div className={styles.searchResult}>
      <span className={styles.routerQuery}>{`'${routerQuery}'`}</span>에 대한
      검색결과
    </div>
  ) : (
    ""
  )

  return (
    <>
      {fetchUrl.length > 0 ? (
        <div className={styles.container}>
          {searchResult}
          <div className={styles.listingsContainer}>
            {fetchUrl.map((data: any) => {
              return (
                <ListingsCard key={data._id} userId={data._id} data={data} />
              )
            })}
          </div>
        </div>
      ) : (
        <Empty showReset />
      )}
    </>
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
