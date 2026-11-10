"use client"

import Button from "./Button"
import styles from "./Empty.module.css"

import { useRouter } from "@/i18n/navigation"
import Heading from "./Heading"
import { FC } from "react"
import type { ReactNode } from "react"
import { useTranslations } from "next-intl"
import { FiCompass } from "react-icons/fi"
import { getDefaultStore, useSetAtom } from "jotai"
import { loginModalAtom } from "@/jotai/@store/state"

interface EmptyStateProps {
  title?: string
  subtitle?: string
  showReset?: boolean
  actionLabel?: string
  action?: "home" | "login"
  icon?: ReactNode
  onAction?: () => void
}

const EmptyState: FC<EmptyStateProps> = ({
  title,
  subtitle,
  showReset,
  actionLabel,
  action = "home",
  icon,
  onAction,
}) => {
  const t = useTranslations("Common")
  const router = useRouter()
  // Navbar owns the auth dialogs outside the page-level Jotai Provider.
  const openLogin = useSetAtom(loginModalAtom, { store: getDefaultStore() })

  return (
    <div data-ui="empty" className={styles.container}>
      <div data-ui="empty-icon" aria-hidden="true">{icon ?? <FiCompass size={30} />}</div>
      <Heading as="h2" center title={title ?? t("emptyTitle")} subTitle={subtitle ?? t("emptySubtitle")} />
      <div className={styles.buttonWrapper}>
        {showReset && (
          <Button label={actionLabel ?? t("confirm")} onClick={() => onAction ? onAction() : action === "login" ? openLogin(true) : router.push("/")} />
        )}
      </div>
    </div>
  )
}

export default EmptyState
