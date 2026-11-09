"use client"

import Image from "next/image"
import logo from "/public/mainLogo.svg"
import styles from "./Logo.module.css"
import { useRouter } from "@/i18n/navigation"
const Logo = () => {
  const router = useRouter()
  return (
    <Image
      style={{ cursor: "pointer" }}
      onClick={() => {
        router.push("/")
      }}
      className={styles.logo}
      height={50}
      width={100}
      src={logo}
      alt="Restay Logo"
      role="link"
      tabIndex={0}
      onKeyDown={(event) => { if (event.key === "Enter") router.push("/") }}
    />
  )
}

export default Logo
