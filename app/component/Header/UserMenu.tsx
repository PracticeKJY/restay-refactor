// app/@component/UserMenu/UserMenuClient.tsx
"use client";
import { useTranslations } from "next-intl";

import Avatar from "./Avatar";
import styles from "./UserMenu.module.css";
import { AiOutlineMenu } from "react-icons/ai";
import { loginModalAtom, menuOpenAtom, registerModalAtom, rentModalAtom } from "../../../jotai/@store/state";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "@/i18n/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";

type Props = {
  session: Session | null;
};

const LoginModal = dynamic(() => import("../Modal/LoginModal"));
const RegisterModal = dynamic(() => import("../Modal/RegisterModal"));
const RentModal = dynamic(() => import("../Modal/RentModal"));

function MenuAction({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button type="button" className={`${styles.pointer} ${styles.menuAction}`} onClick={onClick}>
      {children}
    </button>
  );
}

const UserMenu = ({ session }: Props) => {
  const t = useTranslations("Navigation");

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
    <div data-ui="user-dropdown" ref={userMenuOpenRef} className={styles.userMenuOpen}>
      <LogoutMenu session={session} />
    </div>
  ) : (
    <div data-ui="user-dropdown" ref={userMenuOpenRef} className={styles.userMenuOpen}>
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
            <div className={styles.hostingText}>{session ? t("whereWouldYouLikeToGoToday", { p0: session.user?.name ?? t("member") }) : t("shareYourSpace")}</div>
          </div>

          <div
            ref={userMenuRef}
            role="button"
            tabIndex={0}
            aria-label={t("menu")}
            aria-expanded={isMenuOpen}
            className={styles.userMenu}
            onClick={handleMenuOpen}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleMenuOpen();
              }
            }}>
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
  const t = useTranslations("Navigation");

  const isLoginModal = useAtomValue(loginModalAtom);
  const isRegisterModal = useAtomValue(registerModalAtom);
  const setLoginModal = useSetAtom(loginModalAtom);
  const setRegisterModal = useSetAtom(registerModalAtom);

  return (
    <>
      <MenuAction onClick={() => setLoginModal(!isLoginModal)}>{t("logIn")}</MenuAction>
      <MenuAction onClick={() => setRegisterModal(!isRegisterModal)}>{t("signUp")}</MenuAction>
    </>
  );
};

// ---------------------------
// 로그아웃 메뉴
const LogoutMenu = ({ session }: { session: Session }) => {
  const t = useTranslations("Navigation");

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
      toast.error((error as any)?.message ?? t("couldNotLogOut"));
    }
  };

  return (
    <>
      <MenuAction onClick={() => router.push("/trips")}>{t("trips")}</MenuAction>
      <MenuAction onClick={onClickHosting}>{t("hosting")}</MenuAction>
      <MenuAction
        onClick={() => {
          router.push("/wishList");
          setIsMenuOpen(!isMenuOpen);
        }}>
        {t("wishlist")}
      </MenuAction>
      <MenuAction onClick={() => { router.push("/messages"); setIsMenuOpen(false); }}>{t("messages")}</MenuAction>
      <MenuAction onClick={logOutHandler}>{t("logOut")}</MenuAction>
    </>
  );
};
