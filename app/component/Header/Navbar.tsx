"use client";

import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import styles from "./Navbar.module.css";
import UserMenu from "./UserMenu";
import Categories from "./Categories";
import { useEffect, useRef } from "react";
import type { Session } from "next-auth";
import LanguageSelector from "./LanguageSelector";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface NavbarProps {
  session: Session | null;
}

const Navbar = ({ session }: NavbarProps) => {
  const navbar = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isModern = !/^\/(listings|reservation)(\/|$)/.test(pathname);
  const t = useTranslations("HomeDesign");
  const navigation = useTranslations("Navigation");

  useEffect(() => {
    const handleScroll = () => {
      if (!navbar.current || isModern) {
        return;
      }

      if (window.scrollY < 90) {
        return (navbar.current.style.cssText = "");
      }

      navbar.current.style.cssText = `
      position:fixed; 
      top:0; 
      background:#fff; 
      z-index:200; 
      width:100%;      
      `;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isModern]);

  if (isModern) return (
    <header data-restay-shell data-restay-home={isHome || undefined} className={styles.homeHeader}>
      <div className={styles.homeNav}>
        <div className={styles.homeLogo}><Logo /></div>
        <nav className={styles.homeLinks} aria-label={t("navigation")}>
          <Link href="/" aria-current={isHome ? "page" : undefined}>{t("stays")}</Link>
          <Link href="/wishList" aria-current={pathname === "/wishList" ? "page" : undefined}>{navigation("wishlist")}</Link>
          <Link href="/trips" aria-current={pathname === "/trips" ? "page" : undefined}>{navigation("trips")}</Link>
          <Link href="/messages" aria-current={pathname.startsWith("/messages") ? "page" : undefined}>{navigation("messages")}</Link>
        </nav>
        <div className={styles.accountControls}><LanguageSelector /><UserMenu session={session} /></div>
      </div>
    </header>
  );

  return (
    <>
      <div className={styles.navbarWrapper} ref={navbar}>
        <Container>
          <div className={styles.navbarMenu}>
            <div className={styles.logoSearchWrapper}>
              <Logo />
              <Search />
            </div>
            <div className={styles.accountControls}>
              <UserMenu session={session} />
              <LanguageSelector />
            </div>
          </div>
        </Container>
      </div>
      <Categories />
    </>
  );
};

export default Navbar;
