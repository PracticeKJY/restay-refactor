"use client";

import { useTranslations } from "next-intl";
import { FiAlertCircle } from "react-icons/fi";

export default function ErrorPage({ reset }: { reset: () => void }) {
  const t = useTranslations("Common");
  const design = useTranslations("WorkspaceDesign");
  return <main data-ui="route-state" style={{ padding: "3rem 1rem", textAlign: "center" }}>
    <FiAlertCircle data-ui="state-extra" size={32} aria-hidden="true" />
    <h1>{t("errorTitle")}</h1>
    <p data-ui="state-extra">{design("errorDescription")}</p>
    <button type="button" onClick={reset}>{t("retry")}</button>
  </main>;
}
