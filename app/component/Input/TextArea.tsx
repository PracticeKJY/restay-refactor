"use client"
import { useTranslations } from "next-intl";


import { FC, useState } from "react"
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form"
import styles from "./TextArea.module.css"
import { BiWon } from "react-icons/bi"

interface TextAreaProps {
  id: string
  label: string
  type?: string
  disabled?: boolean
  formatPrice?: boolean
  required?: boolean
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
}

const TextArea: FC<TextAreaProps> = ({
  id,
  label,
  disabled,
  formatPrice,
  required,
  register,
  errors,
}) => {
  const t = useTranslations("Common");

  const [inputFocused, setInputFocused] = useState(false)

  const handleOnFocus = () => setInputFocused(true)
  const handleOnBlur = () => setInputFocused(false)

  return (
    <div className={styles.textAreaContainer}>
      {formatPrice && <BiWon size={16} className={styles.biWon} />}
      <label
        className={`${styles.label} ${
          inputFocused ? styles.textAreaFocused : styles.textAreaNotFocused
        }`}
        htmlFor={id}
      />
      <textarea
        className={`${styles.textArea} 
        ${errors[id] ? styles.textAreaError : ""}
        `}
        id={id}
        disabled={disabled}
        {...register(id, { required })}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        placeholder={t("describeYourSpaceInDetail")}
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

export default TextArea
