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
    description: "해수욕장 혹은 바다가 근처에 있는 숙소입니다.",
  },
  {
    label: "빌라",
    icon: MdOutlineVilla,
    description: "모던하고 프라이빗한 공간들이 준비되어 있어요.",
  },
  {
    label: "애견동반",
    icon: MdPets,
    description: "반려동물 동반이 허용되는 숙소입니다.",
  },
  {
    label: "섬",
    icon: GiIsland,
    description: "근처에 섬에 관한 관광지들이 있어요.",
  },
  {
    label: "호수",
    icon: GiBoatFishing,
    description: "은은하고 멋진 호수 뷰를 즐길수 있는 숙소입니다.",
  },
  {
    label: "스키",
    icon: FaSkiing,
    description: "근처에 스키를 즐길 수 있는 공간들이 있어요.",
  },
  {
    label: "수영장",
    icon: TbPool,
    description: "프라이빗한 풀이 포함된 숙소입니다.",
  },
  {
    label: "시골",
    icon: TbMountain,
    description: "시골 느낌을 경험할 수 있는 숙소입니다.",
  },
  {
    label: "캠핑",
    icon: GiForestCamp,
    description: "캠핑 혹은 카라반을 즐길 수 있는 숙소입니다.",
  },
  {
    label: "특별한 시설",
    icon: IoDiamond,
    description: "특별한 경험을 체험할 수 있는 숙소입니다.",
  },
  {
    label: "동굴",
    icon: GiCaveEntrance,
    description: "근처에 동굴에 관한 관광지들이 있어요",
  },
  {
    label: "풍차",
    icon: GiWindmill,
    description: "근처에 풍차에 관한 관광지들이 있어요",
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
