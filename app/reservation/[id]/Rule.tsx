"use client"

import styles from "./Reservation.module.css"
import Image from "next/image"

const Rule = () => {
  return (
    <div className={styles.ruleContainer}>
      <div className={styles.ruleTitle}>기본 규칙</div>
      <div className={styles.ruleIntro}>
        훌륭한 게스트가 되기 위한 몇 가지 간단한 규칙을 지켜주실 것을 모든
        게스트에게 당부드리고 있습니다.
      </div>
      <ul className={styles.ruleList}>
        <li>
          <span>첫번째</span>. 숙소 이용규칙을 준수해주세요.
        </li>
        <li>
          <span>두번째</span>. 호스트의 집도 자신의 집처럼 아껴주세요.
        </li>
      </ul>
      <div className={styles.confirmedInfoContainer}>
        <div className={styles.confirmedImage}>
          <Image
            alt=""
            src={"/ic-conf-reservation.svg"}
            width={30}
            height={30}
          />
        </div>
        <div>
          <span>
            호스트가 24시간 이내 예약 요청을 수락하기 전까지는 예약이 아직
            확정된 것이 아닙니다.
          </span>{" "}
          예약 확정 전까지는 요금이 청구되지 않습니다.
        </div>
      </div>
    </div>
  )
}

export default Rule
