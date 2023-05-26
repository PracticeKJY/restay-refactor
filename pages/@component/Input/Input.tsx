"use client"

import { FC, useState } from "react"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"
import styles from "./Input.module.css"
import { BiDollar } from "react-icons/bi"

interface InputProps {
  id: string
  label: string
  type?: string
  disabled?: boolean
  formatPrice?: boolean
  required?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
}

const Input: FC<InputProps> = ({
  id,
  label,
  type = "text",
  disabled,
  formatPrice,
  required,
  register,
  errors,
}) => {
  const [inputFocused, setInputFocused] = useState(false)

  const handleOnFocus = () => setInputFocused(true)
  const handleOnBlur = () => setInputFocused(false)

  return (
    <div className={styles.inputContainer}>
      <form action="">
        {formatPrice && <BiDollar size={24} className={styles.biDollar} />}
        <label
          className={`${styles.label} ${
            inputFocused ? styles.inputFocused : styles.inputNotFocused
          }`}
          htmlFor={id}
        >
          {label}
        </label>
        <input
          className={`${styles.input} ${inputFocused ? styles.inputFocus : ""}`}
          id={id}
          type={type}
          disabled={disabled}
          {...register(id, { required })}
          placeholder=""
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
        {errors.id && typeof errors.id === "string" && <span>{errors.id}</span>}
      </form>
    </div>
  )
}

export default Input
