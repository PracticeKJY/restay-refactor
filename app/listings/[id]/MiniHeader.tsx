"use client"
import { useTranslations } from "next-intl";


import styles from "./DetailListingPage.module.css"
import { useEffect, useState } from "react"

const MiniHeader = ({ topRef, bodyRef, mapRef }: any) => {
  const t = useTranslations("Listings");

  const [isShow, setIsShow] = useState(false)

  const moveToTop = () => {
    if (topRef) {
      topRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }
  const moveToBodyInfo = () => {
    if (bodyRef) {
      bodyRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }
  const moveToMapInfo = () => {
    if (mapRef) {
      mapRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setIsShow(true)
      } else {
        setIsShow(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <div className={`${isShow ? styles.displayNav : styles.notdisplayNav}`}>
      <div className={styles.detailListingNavContainer}>
        <div className={styles.detailListingNavWrapper}>
          <button className={styles.borderNone} onClick={moveToTop}>
            {t("photos")}</button>
          <button className={styles.borderNone} onClick={moveToBodyInfo}>
            {t("aboutThisStay")}</button>
          <button className={styles.borderNone} onClick={moveToMapInfo}>
            {t("location")}</button>
        </div>
      </div>
    </div>
  )
}

export default MiniHeader
