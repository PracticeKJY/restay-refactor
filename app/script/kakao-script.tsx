// app/kakao-script.tsx
"use client";

import Script from "next/script";
import React, { ReactNode } from "react";
export const API = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&libraries=services,clusterer&autoload=false`;

export default function KakaoScript() {
  return <Script src={API} strategy="beforeInteractive" />;
}
