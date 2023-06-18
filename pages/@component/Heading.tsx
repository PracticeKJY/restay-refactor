"use client"

import { FC } from "react"

interface HeadingProps {
  title: string
  subTitle?: string
  center?: boolean
}

const Heading: FC<HeadingProps> = ({ title, subTitle, center }) => {
  return (
    <div style={{ textAlign: center ? "center" : "start" }}>
      <div style={{ fontSize: "1.5rem", fontWeight: "700" }}>{title}</div>
      <div
        style={{
          fontWeight: "300",
          marginTop: "0.5rem",
          color: "#737373",
        }}
      >
        {subTitle}
      </div>
    </div>
  )
}

export default Heading
