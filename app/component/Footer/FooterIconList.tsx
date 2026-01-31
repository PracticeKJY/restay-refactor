"use client"

import styles from "./Footer.module.css"
import Image from "next/image"

const FooterIconList = () => {
  return (
    <div className={styles.footerIconWrapper}>
      <Image src={"/ic-blog.svg"} alt="" width={40} height={40} />
      <Image src={"/ic-face-book.svg"} alt="" width={40} height={40} />
      <Image src={"/ic-instagram.svg"} alt="" width={40} height={40} />
      <Image src={"/ic-naver-post.svg"} alt="" width={40} height={40} />
      <Image src={"/ic-youtube.svg"} alt="" width={40} height={40} />
    </div>
  )
}

export default FooterIconList
