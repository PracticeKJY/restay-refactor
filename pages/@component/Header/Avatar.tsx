import Image from "next/image"
import avatar from "/public/placeHolder.jpg"
import { FC } from "react"
import styles from "./Avatar.module.css"
type AccountImageProps = {
  accountImage?: string | null | undefined
}

const Avatar: FC<AccountImageProps> = ({ accountImage }) => {
  return (
    <Image
      style={{ borderRadius: "9999px" }}
      width={30}
      height={30}
      alt="Avatar"
      src={accountImage || avatar}
    />
  )
}

export default Avatar
