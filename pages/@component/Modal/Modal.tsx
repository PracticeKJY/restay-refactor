"use client"
import { FC, useCallback, useEffect, useState } from "react"
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

  useEffect(() => {
    setShowModal(isOpen)
  }, [isOpen])

  //모달창을 띄었을 시, 외부 스크롤을 막는 로직

  useEffect(() => {
    document.body.style.cssText = `
      position: fixed;
      top: -${window.scrollY}px;
      overflow-y: scroll;
      width: 100%;
    `

    // 스크롤바를 없애는 스타일 속성을 추가
    document.body.style.overflow = "hidden"
    // 파이어폭스 ver
    document.body.style.setProperty("scrollbar-width", "none")
    return () => {
      const scrollY = document.body.style.top
      document.body.style.cssText = ""
      document.body.style.overflow = ""
      document.body.style.setProperty("scrollbar-width", "")
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1)
    }
  }, [])

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
