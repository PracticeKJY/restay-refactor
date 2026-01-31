"use client"

import styles from "./Counter.module.css"
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
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.title}>{title}</div>
        <div className={styles.subTitle}>{subTitle}</div>
      </div>
      <div className={styles.counterButtonWrapper}>
        <div onClick={onReduce} className={styles.counterButton}>
          <AiOutlineMinus />
        </div>
        <div className={styles.counterValue}>{value}</div>
        <div onClick={onAdd} className={styles.counterButton}>
          <AiOutlinePlus />
        </div>
      </div>
    </div>
  )
}

export default Counter
