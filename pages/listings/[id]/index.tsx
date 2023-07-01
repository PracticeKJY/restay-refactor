import axios from "axios"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
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

  const updateDetailListing = useCallback(
    (data: any) => {
      setDetailListing(data)
    },
    [setDetailListing],
  )

  useEffect(() => {
    const getDetailListingData = async () => {
      try {
        setIsLoading(true)
        const response = await axios.post(
          "/api/listings/getListingInfo",
          router.query,
        )
        updateDetailListing(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    getDetailListingData()
  }, [router.query, updateDetailListing])

  return isLoading || DetailListing === null ? (
    <Spinner />
  ) : (
    <DetailListingPage listingData={DetailListing} />
  )
}

export default Listings
