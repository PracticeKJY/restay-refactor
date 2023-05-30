"use client"

import { useRecoilState } from "recoil"
import Avatar from "./Avatar"
import styles from "./UserMenu.module.css"
import { AiOutlineMenu } from "react-icons/ai"
import {
  useLoginModal,
  useMenuOpen,
  useRegisterModal,
} from "@/pages/@recoil/store/state"
import LoginModal from "../Modal/LoginModal"
import RegisterModal from "../Modal/RegisterModal"
import { signOut, useSession } from "next-auth/react"
import toast from "react-hot-toast"

const UserMenu = () => {
  const { data: session, status: sessionStatus } = useSession()

  console.log(session, "세션의 정보")
  console.log(sessionStatus, "세션의 status")

  const [isMenuOpen, setIsMenuOpen] = useRecoilState(useMenuOpen)

  const handleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const userMenu = session ? (
    <div className={styles.userMenuOpen}>
      <LogoutMenu />
    </div>
  ) : (
    <div className={styles.userMenuOpen}>
      <LoginMenu />
    </div>
  )

  return (
    <>
      <div style={{ position: "relative" }}>
        <div className={styles.userMenuWrapper}>
          <div className={styles.userMenuText}>
            {session
              ? `${session.user?.name}님 오늘은 어디로 떠나보실래요?`
              : "당신의 공간을 공유하세요"}
          </div>
          <div className={styles.userMenu} onClick={handleMenuOpen}>
            <AiOutlineMenu />
            <Avatar accountImage={session ? session.user?.image : ""} />
          </div>
        </div>
        {isMenuOpen && userMenu}
      </div>
    </>
  )
}

export default UserMenu

//로그인메뉴
const LoginMenu = () => {
  const [isLoginModal, isSetLoginModal] = useRecoilState(useLoginModal)
  const [isRegisterModal, isSetRegisterModal] = useRecoilState(useRegisterModal)

  const handleLoginModalOpen = () => {
    isSetLoginModal(!isLoginModal)
  }

  const handleRegisterModalOpen = () => {
    isSetRegisterModal(!isRegisterModal)
  }

  return (
    <>
      <div className={styles.loginComponent} onClick={handleLoginModalOpen}>
        로그인
      </div>
      {isLoginModal && <LoginModal />}
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

//로그아웃메뉴
const LogoutMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useRecoilState(useMenuOpen)

  const logOutHandler = async () => {
    try {
      await signOut({
        redirect: false,
        callbackUrl: "/",
      })

      toast.success("또 만났으면 좋겠어요!🤙")
      setIsMenuOpen(!isMenuOpen)
    } catch (error) {
      toast.error((error as any).message)
    }
  }

  return (
    <>
      <div className={styles.registerComponent} onClick={() => {}}>
        여행
      </div>
      <div className={styles.registerComponent} onClick={() => {}}>
        호스팅
      </div>
      <div className={styles.registerComponent} onClick={() => {}}>
        위시리스트
      </div>
      <div className={styles.registerComponent} onClick={() => {}}>
        메세지
      </div>
      <div className={styles.registerComponent} onClick={logOutHandler}>
        로그아웃
      </div>
    </>
  )
}
