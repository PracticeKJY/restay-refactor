// Locale-aware root layout keeps messages and HTML language in the same segment.
import type { Metadata } from "next";
import "../../styles/globals.css";

import Providers from "@/app/provider/Provider";
import Footer from "@/app/component/Footer/Footer";
import NavbarSC from "@/app/component/Header/NavbarSC";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getLocale, getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

// 1/7 todo. route.ts 생성
// todo. 리뷰기능, 결제기능(테스트용)

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations("Metadata");
  return {
  metadataBase: new URL("https://restay.vercel.app"),
  title: t("title"),
  description: t("description"),
  openGraph: {
    type: "website",
    title: t("title"),
    description: t("description"),
    locale: locale === "en" ? "en_US" : "ko_KR",
    url: "https://restay.vercel.app",
    images: [{ url: "https://restay.vercel.app/mainLogo.svg", width: 410, height: 200 }],
  },
  icons: { icon: "/restay.png" },
  };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const clientMessages = Object.fromEntries(Object.entries(messages).filter(([namespace]) => namespace !== "Footer" && namespace !== "Metadata"));
  const navbar = await NavbarSC();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body>
        <NextIntlClientProvider messages={clientMessages}>
        {navbar}
        <Providers>
          {children}
          <Footer />
        </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
