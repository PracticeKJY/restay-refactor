//after

import { POST } from "@/app/@http/request";
import DetailListingClient from "@/app/listings/[id]/DetailListingClient";
import { auth } from "@/auth";
import { DetailListingAtomProps } from "@/jotai/@store/state";

export const runtime = "nodejs";

interface ListingDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}
export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const session = await auth();

  const { id } = await params;

  const res = await fetch(`${process.env.NEXTAUTH_URL ?? ""}/api/listings/${id}`, {
    method: "GET",
  });

  // const res = await POST<DetailListingAtomProps>(`/api/listings/${id}`, JSON.stringify({ id }));

  const data = (await res.json()) as DetailListingAtomProps;

  const listingDataWithSession = {
    ...data,
    sessionEmail: session?.user?.email ?? "",
  };

  return <DetailListingClient sessionEmail={session?.user?.email ?? ""} listingData={data} />;
}

//before
// import axios from "axios"
// import { useRouter } from "next/router"
// import { useCallback, useEffect, useState } from "react"
// import DetailListingPage from "./DetailListingPage"
// import { DetailListingAtom } from "../../../jotai/@store/state"
// import { useAtom } from "jotai"
// import Spinner from "@/pages/Spinner"
// import { GetServerSideProps, InferGetServerSidePropsType } from "next"

// type Data = {
//   category: string
//   location: string
//   guestCount: number
//   roomCount: number
//   bathroomCount: number
//   imageSrc: string[] | undefined
//   price: number
//   title: string
//   description: string
//   userId: any
//   createdAt: any
//   latlngData: any
//   userName: string
//   userImage: string
// }

// export const getServerSideProps: GetServerSideProps<{
//   listingDataProps: Data
// }> = async (context) => {
//   const id = context.params?.id
//   const res = await axios.post(
//     "https://restay.vercel.app/api/listings/getListingInfo",
//     { id: id },
//   )
//   const listingDataProps = res.data
//   return { props: { listingDataProps } }
// }

// const Listings = ({
//   listingDataProps,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
//   const [isLoading, setIsLoading] = useState(true)
//   const [detailListing, setDetailListing] = useAtom(DetailListingAtom)

//   const updateDetailListing = useCallback(
//     (data: any) => {
//       setDetailListing(data)
//     },
//     [setDetailListing],
//   )

//   useEffect(() => {
//     setIsLoading(false)
//     updateDetailListing(listingDataProps)
//   }, [updateDetailListing, listingDataProps])

//   return (
//     <>
//       {isLoading ? (
//         <Spinner />
//       ) : (
//         <DetailListingPage listingData={listingDataProps} />
//       )}
//     </>
//   )
// }

// export default Listings
