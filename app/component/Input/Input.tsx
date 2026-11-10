"use client"
import { useTranslations } from "next-intl";


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
  placeHolder?: string
  autoComplete?: string
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
  placeHolder,
  autoComplete,
}) => {
  const t = useTranslations("Common");

  const [inputFocused, setInputFocused] = useState(false)

  const handleOnFocus = () => setInputFocused(true)
  const handleOnBlur = () => setInputFocused(false)

  return (
    <div data-ui="field" className={styles.inputContainer}>
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
        className={`${styles.input} ${inputFocused ? styles.inputFocus : ""} ${
          formatPrice ? styles.formatPrice : ""
        }
        ${errors[id] ? styles.inputError : ""}
        `}
        id={id}
        autoComplete={autoComplete}
        aria-invalid={Boolean(errors[id])}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
        type={type}
        disabled={disabled}
        {...register(id, {
          required: required && t("thisFieldIsRequired"),
          ...(id === "email"
            ? {
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: t("enterAValidEmailAddress"),
                },
              }
            : {}),
          ...(id === "name"
            ? {
                pattern: {
                  value: /^[ㄱ-ㅎ|가-힣|]+$/,
                  message: t("namesMustUseKoreanCharacters"),
                },
              }
            : {}),
          ...(id === "password"
            ? {
                minLength: {
                  value: 4,
                  message: t("passwordsMustContainAtLeast4Characters"),
                },
                maxLength: {
                  value: 12,
                  message: t("passwordsCanContainUpTo12Characters"),
                },
              }
            : {}),
        })}
        placeholder={placeHolder}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
      />
      {errors[id] ? (
        <span id={`${id}-error`} role="alert" className={styles.errorText}>
          {errors[id]?.message?.toString()}
        </span>
      ) : (
        ""
      )}
    </div>
  )
}

export default Input
