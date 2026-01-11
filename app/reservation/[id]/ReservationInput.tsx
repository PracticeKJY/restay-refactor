"use client"

import styles from "./Reservation.module.css"

import { FC, useState } from "react"

interface ReservationInputProps {
  title: string
  id: string
  maxLength?: number
  value?: any
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  placeholder?: string
}

const ReservationInput: FC<ReservationInputProps> = ({
  title,
  id,
  maxLength,
  value,
  onChange,
  placeholder,
}) => {
  const [inputFocused, setInputFocused] = useState(false)

  const handleOnFocus = () => setInputFocused(true)
  const handleOnBlur = () => setInputFocused(false)

  return (
    <div className={styles.inputContainer}>
      <label
        className={`${styles.label} ${
          inputFocused ? styles.inputFocused : styles.inputNotFocused
        }`}
        htmlFor={id}
      >
        {title}
      </label>
      <input
        className={styles.input}
        id={id}
        type="text"
        maxLength={maxLength}
        value={value}
        onChange={onChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        placeholder={placeholder}
      />
    </div>
  )
}

export default ReservationInput
