"use client"

import Image from "next/image"
import logo from "/public/mainLogo.svg"
import styles from "./Logo.module.css"
import { useRouter } from "next/navigation"
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
      priority
    />
  )
}

export default Logo
