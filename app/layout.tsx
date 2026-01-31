// app/layout.tsx
import type { Metadata } from "next";
import "../styles/globals.css";

import KakaoScript from "@/app/script/kakao-script";
import Providers from "@/app/provider/Provider";
import Footer from "@/app/component/Footer/Footer";
import NavbarSC from "@/app/component/Header/NavbarSC";
import PortOneScript from "@/app/script/portone-script";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// 1/7 todo. route.ts 생성
// todo. 리뷰기능, 결제기능(테스트용)

export const metadata: Metadata = {
  title: "여행, 그리고 휴식 -Restay ",
  description: "restay homepage",
  openGraph: {
    type: "website",
    title: "여행, 그리고 휴식 -Restay ",
    description: "문득 어디로 떠나고 싶을 땐 Restay!",
    url: "https://restay.vercel.app",
    images: [{ url: "https://restay.vercel.app/mainLogo.svg", width: 410, height: 200 }],
  },
  icons: { icon: "/restay.png" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const navbar = await NavbarSC();

  return (
    <html lang="ko-KR" suppressHydrationWarning>
      <body>
        <KakaoScript />
        <PortOneScript />
        {navbar}
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
