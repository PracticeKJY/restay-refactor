"use client"

import Container from "../Container"
import styles from "./Categories.module.css"
import { TbBeach, TbMountain, TbPool } from "react-icons/tb"
import {
  GiBoatFishing,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from "react-icons/gi"
import { FaSkiing } from "react-icons/fa"
import { MdPets } from "react-icons/md"
import { BsSnow } from "react-icons/bs"
import { IoDiamond } from "react-icons/io5"
import { MdOutlineVilla } from "react-icons/md"
import CategoryBox from "../CategoryBox"
import { usePathname, useSearchParams } from "next/navigation"

export const categories = [
  {
    label: "해변 근처",
    icon: TbBeach,
    description: "This property is close to the beach!",
  },
  {
    label: "빌라",
    icon: MdOutlineVilla,
    description: "This property is modern!",
  },
  {
    label: "애견동반",
    icon: MdPets,
    description: "This property is in arctic environment!",
  },
  {
    label: "섬",
    icon: GiIsland,
    description: "This property is on an island!",
  },
  {
    label: "호수",
    icon: GiBoatFishing,
    description: "This property is near a lake!",
  },
  {
    label: "스키",
    icon: FaSkiing,
    description: "This property has skiing activies!",
  },
  {
    label: "수영장",
    icon: TbPool,
    description: "This is property has a beautiful pool!",
  },
  {
    label: "시골",
    icon: TbMountain,
    description: "This property is in the countryside!",
  },
  {
    label: "캠핑",
    icon: GiForestCamp,
    description: "This property offers camping activities!",
  },
  {
    label: "특별한 시설",
    icon: IoDiamond,
    description: "This property is brand new and luxurious!",
  },
  {
    label: "동굴",
    icon: GiCaveEntrance,
    description: "This property is in a spooky cave!",
  },
  {
    label: "풍차",
    icon: GiWindmill,
    description: "This property is has windmills!",
  },
]

const Categories = () => {
  const params = useSearchParams()
  const category = params?.get("category")
  const pathname = usePathname()

  const isMainPage = pathname === "/"

  if (!isMainPage) {
    return null
  }

  return (
    <Container>
      <div className={styles.categoryWrapper}>
        {categories.map((item) => (
          <CategoryBox
            key={item.label}
            label={item.label}
            icon={item.icon}
            selected={category === item.label}
          />
        ))}
      </div>
    </Container>
  )
}

export default Categories
