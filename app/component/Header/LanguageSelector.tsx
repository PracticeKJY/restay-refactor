"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import styles from "./LanguageSelector.module.css";

export default function LanguageSelector() {
  const locale = useLocale();
  const t = useTranslations("Navigation");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select aria-label={t("language")} aria-busy={pending} className={styles.selector} value={locale} disabled={pending}
      onChange={(event) => {
        const nextLocale = event.target.value === "en" ? "en" : "ko";
        const query = searchParams.toString();
        const href = `${pathname}${query ? `?${query}` : ""}${window.location.hash}`;
        startTransition(() => router.replace(href, { locale: nextLocale, scroll: false }));
      }}>
      <option value="ko">한국어</option>
      <option value="en">English</option>
    </select>
  );
}
