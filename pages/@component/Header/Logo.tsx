"use client"

import Image from "next/image"
import logo from "/public/mainLogo.svg"
import styles from "./Logo.module.css"
const Logo = () => {
  return (
    <Image
      className={styles.logo}
      height={50}
      width={100}
      src={logo}
      alt="Restay Logo"
    />
  )
}

export default Logo
