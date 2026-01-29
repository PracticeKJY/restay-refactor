// app/portone-script.tsx
"use client";

import Script from "next/script";
import React, { ReactNode } from "react";
export const API = `//cdn.iamport.kr/v1/iamport.js`;

export default function PortOneScript() {
  return <Script src={API} strategy="beforeInteractive" />;
}
