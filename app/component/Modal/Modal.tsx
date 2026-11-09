"use client"
import { FC, useCallback, useEffect, useState, useRef, useId } from "react"
import { useTranslations } from "next-intl"
import { useDialogFocus } from "@/app/hooks/useDialogFocus"
import styles from "./Modal.module.css"
import { IoMdClose } from "react-icons/io"
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
  outline?: any
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
  outline,
}) => {
  const t = useTranslations("Common")
  const dialogRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current) }, [])
  const [showModal, setShowModal] = useState(false)
  useEffect(() => {
    setShowModal(isOpen)
  }, [isOpen])

  // Restore the previous inline styles when this dialog closes.
  useEffect(() => {
    const previousStyle = document.body.style.cssText
    if (isOpen) {
      document.body.style.cssText = ` 
      width:100%;
      padding-right:12px; 
      overflow:hidden`
    }
    return () => {
      document.body.style.cssText = previousStyle
    }
  }, [isOpen])

  const handleSubmit = useCallback(() => {
    if (disabled || !onSubmit) {
      return
    }

    onSubmit()
  }, [onSubmit, disabled])

  const handleClose = useCallback(() => {
    if (closeTimer.current) return
    setShowModal(false)
    closeTimer.current = setTimeout(() => {
      closeTimer.current = null
      onClose()
    }, 300)
  }, [onClose])

  const handleSecondaryAction = useCallback(() => {
    if (disabled || !secondaryAction) {
      return
    }

    secondaryAction()
  }, [secondaryAction, disabled])

  useDialogFocus(isOpen, dialogRef, handleClose)

  if (!isOpen) {
    return null
  }

  const modalTransitionClass = showModal ? styles.modalShow : styles.modalHide

  return (
    <div className={styles.modalWrapper}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={title ? titleId : undefined} aria-label={title ? undefined : actionLabel} tabIndex={-1} className={`${styles.modalContainer} ${modalTransitionClass}`}>
        <div className={styles.modalHeaderContainer}>
          <button type="button" aria-label={t("close")} onClick={handleClose} className={styles.closeButton}>
            <IoMdClose size={18} />
          </button>
          <div id={titleId}>{title}</div>
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
              outline={outline}
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
