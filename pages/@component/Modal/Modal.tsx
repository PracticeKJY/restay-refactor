"use client"
import { FC, useCallback, useEffect, useState } from "react"
import styles from "./Modal.module.css"
import { IoMdClose } from "react-icons/io"
import { useLoginModal } from "@/pages/@recoil/store/state"
import { useRecoilState } from "recoil"
import { SubmitHandler, FieldValues, useForm } from "react-hook-form"
import Heading from "../Heading"
import Input from "../Input/Input"
import Button from "../Button"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: () => void
  title?: string
  body?: React.ReactElement
  footer?: React.ReactElement
  actionLabel: string
  disabled?: boolean
  secondaryAction?: () => void
  secondaryActionLabel?: string
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
  secondaryAction,
  secondaryActionLabel,
}) => {
  const [showModal, setShowModal] = useState(false)
  const [isLoginModal, isSetLoginModal] = useRecoilState(useLoginModal)

  useEffect(() => {
    setShowModal(isOpen)
  }, [isOpen])

  const handleSubmit = useCallback(() => {
    if (disabled || !onSubmit) {
      return
    }

    onSubmit()
  }, [onSubmit, disabled])

  const handleClose = useCallback(() => {
    if (disabled) {
      return
    }

    setShowModal(false)
    setTimeout(() => {
      onClose()
    }, 300)
  }, [onClose, disabled])

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return
    }

    secondaryAction()
  }, [secondaryAction, disabled])

  if (!isOpen) {
    return null
  }

  const modalTransitionClass = showModal ? styles.modalShow : styles.modalHide

  return (
    <div className={styles.modalWrapper}>
      <div className={`${styles.modalContainer} ${modalTransitionClass}`}>
        <div className={styles.modalHeaderContainer}>
          <button onClick={handleClose} className={styles.closeButton}>
            <IoMdClose size={18} />
          </button>
          <div>{title}</div>
        </div>
        <div className={styles.modalBodyContainer}>{body}</div>
        <div className={styles.modalFooterContainer}>
          <div className={styles.modalFooterWrapper}>
            {secondaryAction && secondaryActionLabel && (
              <Button
                outline
                disabled={disabled}
                label={secondaryActionLabel}
                onClick={handleSecondaryAction}
              />
            )}
            <Button
              disabled={disabled}
              label={actionLabel}
              onClick={handleSubmit}
            />
          </div>
          {footer}
        </div>
      </div>
    </div>
  )
}

export default Modal
