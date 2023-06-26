"use client"

import Button from "./Button"
import styles from "./Empty.module.css"

import { useRouter } from "next/navigation"
import Heading from "./Heading"
import { FC } from "react"

interface EmptyStateProps {
  title?: string
  subtitle?: string
  showReset?: boolean
}

const EmptyState: FC<EmptyStateProps> = ({
  title = "검색 결과 없음",
  subtitle = "일부 필터를 변경하거나 삭제하여 검색 지역을 조정해보세요.",
  showReset,
}) => {
  const router = useRouter()

  return (
    <div className={styles.container}>
      <Heading center title={title} subTitle={subtitle} />
      <div className={styles.buttonWrapper}>
        {showReset && <Button label="확인" onClick={() => router.push("/")} />}
      </div>
    </div>
  )
}

export default EmptyState
