"use client"

import Avatar from "./Avatar"
import styles from "./UserMenu.module.css"
import { AiOutlineMenu } from "react-icons/ai"
import {
  loginModalAtom,
  menuOpenAtom,
  registerModalAtom,
  rentModalAtom,
} from "@/pages/@jotai/store/state"
import LoginModal from "../Modal/LoginModal"
import RegisterModal from "../Modal/RegisterModal"
import { signOut, useSession } from "next-auth/react"
import toast from "react-hot-toast"
import RentModal from "../Modal/RentModal"
import { useAtomValue, useSetAtom } from "jotai"
import { useRouter } from "next/navigation"

const UserMenu = () => {
  const { data: session, status: sessionStatus } = useSession()

  const isMenuOpen = useAtomValue(menuOpenAtom)
  const isRentModal = useAtomValue(rentModalAtom)
  const setIsMenuOpen = useSetAtom(menuOpenAtom)
  const SetIsRentModal = useSetAtom(rentModalAtom)

  const handleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const userMenu = session ? (
    <div className={styles.userMenuOpen}>
      <LogoutMenu session={session} />
    </div>
  ) : (
    <div className={styles.userMenuOpen}>
      <LoginMenu />
    </div>
  )

  const onClick = () => {
    // 회원이 아닐 경우 클릭 이벤트를 막음
    if (!session) {
      return
    }
    SetIsRentModal(!isRentModal)
  }

  return (
    <>
      {isRentModal && <RentModal />}
      <div style={{ position: "relative" }}>
        <div className={styles.userMenuWrapper}>
          <div
            className={`${styles.userMenuText} ${
              session && !isRentModal ? styles.pointer : ""
            }`}
            onClick={onClick}
          >
            <div className={styles.hostingText}>
              {session
                ? `${session.user?.name}님 오늘은 어디로 떠나보실래요?`
                : "당신의 공간을 공유하세요"}
            </div>
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
  const isLoginModal = useAtomValue(loginModalAtom)
  const isRegisterModal = useAtomValue(registerModalAtom)
  const isSetLoginModal = useSetAtom(loginModalAtom)
  const isSetRegisterModal = useSetAtom(registerModalAtom)

  const handleLoginModalOpen = () => {
    isSetLoginModal(!isLoginModal)
  }

  const handleRegisterModalOpen = () => {
    isSetRegisterModal(!isRegisterModal)
  }

  return (
    <>
      <div className={styles.pointer} onClick={handleLoginModalOpen}>
        로그인
      </div>
      {isLoginModal && <LoginModal />}
      <div className={styles.pointer} onClick={handleRegisterModalOpen}>
        회원가입
      </div>
      {isRegisterModal && <RegisterModal />}
    </>
  )
}

//로그아웃메뉴
const LogoutMenu = ({ session }: any) => {
  // console.log(session, "프롭스로받은세션")

  const router = useRouter()
  const isMenuOpen = useAtomValue(menuOpenAtom)
  const isRentModal = useAtomValue(rentModalAtom)
  const setIsMenuOpen = useSetAtom(menuOpenAtom)
  const SetIsRentModal = useSetAtom(rentModalAtom)

  const onClick = () => {
    // 회원이 아닐 경우 클릭 이벤트를 막음
    if (!session) {
      return
    }
    SetIsRentModal(!isRentModal)
  }

  const logOutHandler = async () => {
    try {
      await signOut({
        redirect: true,
        callbackUrl: "/",
      })
      setIsMenuOpen(!isMenuOpen)
    } catch (error) {
      toast.error((error as any).message)
    }
  }

  return (
    <>
      <div className={styles.pointer} onClick={() => {}}>
        여행
      </div>
      <div className={styles.pointer} onClick={onClick}>
        호스팅
      </div>
      <div
        className={styles.pointer}
        onClick={() => {
          router.push("/wishList")
          setIsMenuOpen(!isMenuOpen)
        }}
      >
        위시리스트
      </div>
      <div className={styles.pointer} onClick={() => {}}>
        메세지
      </div>
      <div className={styles.pointer} onClick={logOutHandler}>
        로그아웃
      </div>
    </>
  )
}
