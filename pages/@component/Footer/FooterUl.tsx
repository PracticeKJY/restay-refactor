"use client"

import Link from "next/link"
import styles from "./Footer.module.css"

const FooterUl = () => {
  const footerUlList = [
    "회사소개",
    "이용약관",
    "개인정보처리방침",
    "소비자 분쟁해결 기준",
    "사업자 정보확인",
    "Restay 마케팅센터",
    "액티비티 호스트센터",
    "콘텐츠산업진흥법에의한 표시",
  ]

  return (
    <ul className={styles.ulList}>
      {footerUlList.map((data, index) => {
        return (
          <li className={styles.liList} key={index}>
            <Link href="/">{data}</Link>
          </li>
        )
      })}
    </ul>
  )
}

export default FooterUl
