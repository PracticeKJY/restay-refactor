"use client"

import styles from "./Counter.module.css"
import { useTranslations } from "next-intl"
import { FC, useCallback } from "react"
import {
  AiOutlineMinus,
  AiOutlinePlayCircle,
  AiOutlinePlus,
} from "react-icons/ai"

interface CounterProps {
  title: string
  subTitle: string
  value: number
  onChange: (value: number) => void
}

const Counter: FC<CounterProps> = ({ title, subTitle, value, onChange }) => {
  const t = useTranslations("WorkspaceDesign")
  const onAdd = useCallback(() => {
    onChange(value + 1)
  }, [onChange, value])
  const onReduce = useCallback(() => {
    if (value === 1) {
      return
    }

    onChange(value - 1)
  }, [onChange, value])

  return (
    <div data-ui="counter" className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subTitle}>{subTitle}</div>
      </div>
      <div className={styles.counterButtonWrapper}>
        <button type="button" onClick={onReduce} disabled={value === 1} aria-label={t("decrease", { label: title })} className={styles.counterButton}>
          <AiOutlineMinus />
        </button>
        <div aria-live="polite" className={styles.counterValue}>{value}</div>
        <button type="button" onClick={onAdd} aria-label={t("increase", { label: title })} className={styles.counterButton}>
          <AiOutlinePlus />
        </button>
      </div>
    </div>
  )
}

export default Counter
