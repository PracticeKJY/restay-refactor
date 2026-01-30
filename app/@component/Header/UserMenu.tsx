// app/@component/UserMenu/UserMenuClient.tsx
"use client";

import Avatar from "./Avatar";
import styles from "./UserMenu.module.css";
import { AiOutlineMenu } from "react-icons/ai";
import { loginModalAtom, menuOpenAtom, registerModalAtom, rentModalAtom } from "../../../jotai/@store/state";
import LoginModal from "../Modal/LoginModal";
import RegisterModal from "../Modal/RegisterModal";
import toast from "react-hot-toast";
import RentModal from "../Modal/RentModal";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

type Props = {
  session: Session | null;
};

const UserMenu = ({ session }: Props) => {
  const isAuthed = !!session?.user && !session?.error;

  const isMenuOpen = useAtomValue(menuOpenAtom);
  const isRentModal = useAtomValue(rentModalAtom);
  const setIsMenuOpen = useSetAtom(menuOpenAtom);
  const setIsRentModal = useSetAtom(rentModalAtom);

  const isLoginModal = useAtomValue(loginModalAtom);
  const isRegisterModal = useAtomValue(registerModalAtom);

  const userMenuOpenRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleMenuOpen = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const userMenu = session ? (
    <div ref={userMenuOpenRef} className={styles.userMenuOpen}>
      <LogoutMenu session={session} />
    </div>
  ) : (
    <div ref={userMenuOpenRef} className={styles.userMenuOpen}>
      <LoginMenu />
    </div>
  );

  const onClickHosting = () => {
    if (!session) return;
    setIsRentModal(!isRentModal);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!userMenuOpenRef.current?.contains(target) && !userMenuRef.current?.contains(target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setIsMenuOpen]);

  return (
    <>
      {isRentModal && <RentModal />}

      <div style={{ position: "relative" }}>
        <div className={styles.userMenuWrapper}>
          <div className={`${styles.userMenuText} ${session && !isRentModal ? styles.pointer : ""}`} onClick={onClickHosting}>
            <div className={styles.hostingText}>{session ? `${session.user?.name ?? "회원"}님 오늘은 어디로 떠나보실래요?` : "당신의 공간을 공유하세요"}</div>
          </div>

          <div ref={userMenuRef} className={styles.userMenu} onClick={handleMenuOpen}>
            <AiOutlineMenu />
            <Avatar accountImage={session?.user?.image ?? ""} />
          </div>
        </div>

        {isMenuOpen && userMenu}
        {isLoginModal && <LoginModal />}
        {isRegisterModal && <RegisterModal />}
      </div>
    </>
  );
};

export default UserMenu;

// ---------------------------
// 로그인 메뉴
const LoginMenu = () => {
  const isLoginModal = useAtomValue(loginModalAtom);
  const isRegisterModal = useAtomValue(registerModalAtom);
  const setLoginModal = useSetAtom(loginModalAtom);
  const setRegisterModal = useSetAtom(registerModalAtom);

  return (
    <>
      <div className={styles.pointer} onClick={() => setLoginModal(!isLoginModal)}>
        로그인
      </div>
      <div className={styles.pointer} onClick={() => setRegisterModal(!isRegisterModal)}>
        회원가입
      </div>
    </>
  );
};

// ---------------------------
// 로그아웃 메뉴
const LogoutMenu = ({ session }: { session: Session }) => {
  const router = useRouter();
  const isMenuOpen = useAtomValue(menuOpenAtom);
  const isRentModal = useAtomValue(rentModalAtom);
  const setIsMenuOpen = useSetAtom(menuOpenAtom);
  const setIsRentModal = useSetAtom(rentModalAtom);

  const onClickHosting = () => {
    if (!session) return;
    setIsRentModal(!isRentModal);
  };

  const logOutHandler = async () => {
    try {
      // ✅ 클라이언트 signOut (v5에서도 가능)
      await signOut({ redirect: false });
      setIsMenuOpen(!isMenuOpen);
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error((error as any)?.message ?? "로그아웃 실패");
    }
  };

  return (
    <>
      <div className={styles.pointer} onClick={() => router.push("/trips")}>
        여행
      </div>
      <div className={styles.pointer} onClick={onClickHosting}>
        호스팅
      </div>
      <div
        className={styles.pointer}
        onClick={() => {
          router.push("/wishList");
          setIsMenuOpen(!isMenuOpen);
        }}>
        위시리스트
      </div>
      {/* 메세지(채팅) 수정중 */}
      {/* <div className={styles.pointer} onClick={() => router.push("/messages")}>
        메세지
      </div> */}
      <div className={styles.pointer} onClick={logOutHandler}>
        로그아웃
      </div>
    </>
  );
};
