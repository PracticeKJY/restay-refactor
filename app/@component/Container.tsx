"use client"

import { FC } from "react"
import styles from "./Container.module.css"

interface ContainerProps {
  children: React.ReactNode
}

const Container: FC<ContainerProps> = ({ children }) => {
  return <div className={styles.container}>{children}</div>
}

export default Container
