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
  _id: string
}

const Listings = () => {
  const router = useRouter()
  const [DetailListing, setDetailListing] = useAtom(DetailListingAtom)
  const [userInfo, setUserInfo] = useState<Data>()
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

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setIsLoading(true)
        const response = await axios.post("/api/user/findUser", {
          id: DetailListing?.userId,
        })
        setUserInfo(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    if (DetailListing) {
      getUserInfo()
    }
  }, [DetailListing])

  return isLoading ? (
    <Spinner />
  ) : DetailListing && userInfo ? (
    <DetailListingPage listingData={DetailListing} userInfo={userInfo} />
  ) : (
    <div>에러페이지 입니다. -업데이트 예정-</div>
  )
}

export default Listings
