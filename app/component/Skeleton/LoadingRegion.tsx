import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import styles from "./PageSkeleton.module.css";

export default function LoadingRegion({ children, className }: { children: ReactNode; className?: string }) {
  const t = useTranslations("Common");
  return <div className={className} data-ui="skeleton" aria-busy="true">
    <span className={styles.srOnly} role="status">{t("loading")}</span>
    <div aria-hidden="true" style={{ height: "100%", minWidth: 0 }}>{children}</div>
  </div>;
}
