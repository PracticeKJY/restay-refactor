import styles from "./index.module.css"
import { useRecoilValue } from "recoil"
import { nameAtom } from "./@recoil/store/state"
import Container from "./@component/Container"
import axios from "axios"
import { useEffect, useState } from "react"
import Image from "next/image"
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai"
import ListingsCard from "./@component/listings/ListingsCard"

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
  _id: any
}

export default function Home() {
  const [listings, setListings] = useState<Data[]>([])
  const [hasFavorite, setHasFavorite] = useState(false)
  useEffect(() => {
    const getListings = async () => {
      try {
        const response = await axios.get<Data[]>("/api/listings/getListings")
        setListings(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    getListings()
  }, [])

  return (
    <>
      <Container>
        <div className={styles.listingsContainer}>
          {listings.map((data: any) => {
            return <ListingsCard key={data._id} userId={data._id} data={data} />
          })}
        </div>
      </Container>
    </>
  )
}
