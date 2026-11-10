import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FiCompass } from "react-icons/fi";

export default async function NotFound() {
  const t = await getTranslations("Common");
  const design = await getTranslations("WorkspaceDesign");
  return <main data-ui="route-state" style={{ padding: "3rem 1rem", textAlign: "center" }}>
    <FiCompass data-ui="state-extra" size={32} aria-hidden="true" />
    <h1>{t("notFound")}</h1>
    <p data-ui="state-extra">{design("notFoundDescription")}</p>
    <Link href="/">{t("home")}</Link>
  </main>;
}
