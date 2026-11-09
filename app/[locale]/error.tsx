"use client";

import { useTranslations } from "next-intl";

export default function ErrorPage({ reset }: { reset: () => void }) {
  const t = useTranslations("Common");
  return <main style={{ padding: "3rem 1rem", textAlign: "center" }}>
    <h1>{t("errorTitle")}</h1>
    <button type="button" onClick={reset}>{t("retry")}</button>
  </main>;
}
