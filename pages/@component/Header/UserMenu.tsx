"use client"

import { useRecoilState, useRecoilValue } from "recoil"
import Avatar from "./Avatar"
import styles from "./UserMenu.module.css"
import { AiOutlineMenu } from "react-icons/ai"
import { useLoginModal, useRegisterModal } from "@/pages/@recoil/store/state"
import { useState } from "react"
import LoginModal from "../Modal/LoginModal"
import RegisterModal from "../Modal/RegisterModal"

const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginModal, isSetLoginModal] = useRecoilState(useLoginModal)

  const handleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLoginModalOpen = () => {
    isSetLoginModal(!isLoginModal)
  }

  return (
    <>
      <div style={{ position: "relative" }}>
        <div className={styles.userMenuWrapper}>
          <div className={styles.userMenuText}>
            {"당신의 공간을 공유하세요"}
          </div>
          <div className={styles.userMenu} onClick={handleMenuOpen}>
            <AiOutlineMenu />
            <Avatar />
          </div>
        </div>
        {isMenuOpen && (
          <div className={styles.userMenuOpen}>
            <LoginComponent />
            <RegisterComponent />
          </div>
        )}
      </div>
    </>
  )
}

export default UserMenu

const LoginComponent = () => {
  const [isLoginModal, isSetLoginModal] = useRecoilState(useLoginModal)

  const handleLoginModalOpen = () => {
    isSetLoginModal(!isLoginModal)
  }

  return (
    <>
      <div className={styles.loginComponent} onClick={handleLoginModalOpen}>
        로그인
      </div>
      {isLoginModal && <LoginModal />}
    </>
  )
}

const RegisterComponent = () => {
  const [isRegisterModal, isSetRegisterModal] = useRecoilState(useRegisterModal)

  const handleRegisterModalOpen = () => {
    isSetRegisterModal(!isRegisterModal)
  }

  return (
    <>
      <div
        className={styles.registerComponent}
        onClick={handleRegisterModalOpen}
      >
        회원가입
      </div>
      {isRegisterModal && <RegisterModal />}
    </>
  )
}
