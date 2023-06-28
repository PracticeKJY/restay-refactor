"use client"

import styles from "./Spinner.module.css"
import Image from "next/image"
// import { FadeLoader } from "react-spinners"

const Spinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinnerWrapper}>
        <h3>잠시만 기다려주세요.</h3>
        {/* react-spinners 라이브러리를 이용한 스피너 */}
        {/* 주석을 해제하면 적용됩니다. */}
        {/* <FadeLoader
          color="rgb(123, 173, 240)"
          aria-label="Loading Spinner"
          data-testid="loader"
        /> */}
        <div className={styles.imageWrapper}>
          <Image
            className={styles.image}
            src={"/spinner.svg"}
            width={200}
            height={200}
            alt=""
          />
        </div>
      </div>
    </div>
  )
}

export default Spinner
