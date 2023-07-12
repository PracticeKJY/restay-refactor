import axios from "axios"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import DetailListingPage from "./DetailListingPage"
import { DetailListingAtom } from "../../../jotai/@store/state"
import { useAtom } from "jotai"
import Spinner from "@/pages/Spinner"
import { GetServerSideProps, InferGetServerSidePropsType } from "next"

type Data = {
  category: string
  location: string
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

export const getServerSideProps: GetServerSideProps<{
  listingDataProps: Data
}> = async (context) => {
  const id = context.params?.id
  const res = await axios.post(
    "https://restay.vercel.app/api/listings/getListingInfo",
    { id: id },
  )
  const listingDataProps = res.data
  return { props: { listingDataProps } }
}

const Listings = ({
  listingDataProps,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [isLoading, setIsLoading] = useState(true)
  const [detailListing, setDetailListing] = useAtom(DetailListingAtom)

  const updateDetailListing = useCallback(
    (data: any) => {
      setDetailListing(data)
    },
    [setDetailListing],
  )

  useEffect(() => {
    setIsLoading(false)
    updateDetailListing(listingDataProps)
  }, [updateDetailListing, listingDataProps])

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <DetailListingPage listingData={listingDataProps} />
      )}
    </>
  )
}

export default Listings
