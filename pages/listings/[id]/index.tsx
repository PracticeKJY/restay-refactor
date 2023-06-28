import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import DetailListingPage from "./DetailListingPage"
import { DetailListingAtom } from "../../../jotai/@store/state"
import { useAtom } from "jotai"
import Spinner from "@/pages/Spinner"

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
  latlngData: any
  userName: string
  userImage: string
}

const Listings = () => {
  const router = useRouter()
  const [DetailListing, setDetailListing] = useAtom(DetailListingAtom)
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

  return isLoading ? (
    <Spinner />
  ) : DetailListing ? (
    <DetailListingPage listingData={DetailListing} />
  ) : (
    <div>에러페이지 입니다. -업데이트 예정-</div>
  )
}

export default Listings
