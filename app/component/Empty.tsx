"use client"

import Button from "./Button"
import styles from "./Empty.module.css"

import { useRouter } from "@/i18n/navigation"
import Heading from "./Heading"
import { FC } from "react"
import { useTranslations } from "next-intl"

interface EmptyStateProps {
  title?: string
  subtitle?: string
  showReset?: boolean
  actionLabel?: string
}

const EmptyState: FC<EmptyStateProps> = ({
  title,
  subtitle,
  showReset,
  actionLabel,
}) => {
  const t = useTranslations("Common")
  const router = useRouter()

  return (
    <div className={styles.container}>
      <Heading center title={title ?? t("emptyTitle")} subTitle={subtitle ?? t("emptySubtitle")} />
      <div className={styles.buttonWrapper}>
        {showReset && (
          <Button label={actionLabel ?? t("confirm")} onClick={() => router.push("/")} />
        )}
      </div>
    </div>
  )
}

export default EmptyState
