import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import DetailListingPage from "./DetailListingPage"
import { DetailListingAtom } from "@/pages/@jotai/store/state"
import { useAtom } from "jotai"

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
        const response2 = await axios.post("/api/user/findUser", {
          id: DetailListing?.userId,
        })
        setUserInfo(response2.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    getUserInfo()
  }, [DetailListing])

  if (isLoading || !DetailListing || !userInfo) {
    return <div>로딩중입니다...</div>
  }

  return <DetailListingPage listingData={DetailListing} userInfo={userInfo} />
}

export default Listings
