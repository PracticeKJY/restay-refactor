"use client"

import styles from "./Reservation.module.css"

const Refund = () => {
  return (
    <div className={styles.refundContainer}>
      <div className={styles.refundTitle}>환불 정책</div>
      <div className={styles.refundInfo}>
        <div>
          <span>예약일로부터 1주일 전</span>까지 무료로 취소하실 수 있습니다.
        </div>
        <div>
          <span>예약일로부터 6일 전</span>부터는 부분 환불을 받으실 수 있습니다.
        </div>
        <div className={styles.refundMore}>자세히 알아보기</div>
      </div>
    </div>
  )
}

export default Refund
