import Image from "next/image"
import avatar from "/public/placeHolder.jpg"
import { FC } from "react"
type AccountImageProps = {
  accountImage?: string | null | undefined
  width?: number
  height?: number
}

const Avatar: FC<AccountImageProps> = ({
  accountImage,
  width: Width,
  height: Height,
}) => {
  return (
    <Image
      style={{ borderRadius: "9999px" }}
      width={Width ? Width : 30}
      height={Height ? Height : 30}
      alt="Avatar"
      src={accountImage || avatar}
    />
  )
}

export default Avatar
