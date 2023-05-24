"use client"

import Avatar from "./Avatar"
import styles from "./UserMenu.module.css"
import { AiOutlineMenu } from "react-icons/ai"

const UserMenu = () => {
  return (
    <>
      <div style={{ position: "relative" }}>
        <div className={styles.userMenuWrapper}>
          <div className={styles.userMenuText}>
            {"당신의 공간을 공유하세요"}
          </div>
          <div className={styles.userMenu}>
            <AiOutlineMenu />
            <Avatar />
          </div>
        </div>
      </div>
    </>
  )
}

export default UserMenu
