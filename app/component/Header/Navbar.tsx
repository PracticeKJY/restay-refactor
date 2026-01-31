"use client";

import Container from "../Container";
import Logo from "./Logo";
import Search from "./Search";
import styles from "./Navbar.module.css";
import UserMenu from "./UserMenu";
import Categories from "./Categories";
import { useEffect, useRef } from "react";
import type { Session } from "next-auth";

interface NavbarProps {
  session: Session | null;
}

const Navbar = ({ session }: NavbarProps) => {
  const navbar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!navbar.current) {
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
  }, []);

  return (
    <>
      <div className={styles.navbarWrapper} ref={navbar}>
        <Container>
          <div className={styles.navbarMenu}>
            <div className={styles.logoSearchWrapper}>
              <Logo />
              <Search />
            </div>
            <UserMenu session={session} />
          </div>
        </Container>
      </div>
      <Categories />
    </>
  );
};

export default Navbar;
