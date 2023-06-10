import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import DetailListingPage from "./DetailListingPage"

type Data = {
  category: string
  locationValue: string
  guestCount: number
  roomCount: number
  bathroomCount: number
  imageSrc: string[] | undefined
  price: number
  title: string
  description: string
  userId: any
  createdAt: any
  _id: string
}

const Listings = () => {
  const router = useRouter()
  const [DetailListing, setDetailListing] = useState<Data>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getDetailListingData = async () => {
      try {
        const response = await axios.post(
          "/api/listings/getListingInfo",
          router.query,
        )
        setDetailListing(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    getDetailListingData()
  }, [router.query])

  if (!DetailListing) {
    return <div>로딩중입니다...</div>
  }

  return <DetailListingPage listingData={DetailListing} />
}

export default Listings
