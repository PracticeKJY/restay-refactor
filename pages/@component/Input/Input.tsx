"use client"

import { FC, useState } from "react"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"
import styles from "./Input.module.css"
import { BiWon } from "react-icons/bi"

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
      {formatPrice && <BiWon size={16} className={styles.biWon} />}
      <label
        className={`${styles.label} ${
          inputFocused ? styles.inputFocused : styles.inputNotFocused
        }`}
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className={`${styles.input} ${inputFocused ? styles.inputFocus : ""}
        ${errors[id] ? styles.inputError : ""}
        `}
        id={id}
        type={type}
        disabled={disabled}
        {...register(id, {
          required: required && "필수 입력사항입니다.",
          ...(id === "email"
            ? {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "올바른 이메일 주소 형식이 아닙니다.",
                },
              }
            : {}),
          ...(id === "name"
            ? {
                pattern: {
                  value: /^[ㄱ-ㅎ|가-힣|]+$/,
                  message: "이름은 한글만 적을 수 있습니다.",
                },
              }
            : {}),
          ...(id === "password"
            ? {
                minLength: {
                  value: 4,
                  message: "비밀번호는 최소 4자 이상이어야 합니다.",
                },
                maxLength: {
                  value: 12,
                  message: "비밀번호는 최대 12자까지 가능합니다.",
                },
              }
            : {}),
        })}
        placeholder=""
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      />
      {errors[id] ? (
        <span className={styles.errorText}>
          {errors[id]?.message?.toString()}
        </span>
      ) : (
        ""
      )}
    </div>
  )
}

export default Input
