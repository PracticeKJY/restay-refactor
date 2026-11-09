import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("Common");
  return <main style={{ padding: "3rem 1rem", textAlign: "center" }}>
    <h1>{t("notFound")}</h1>
    <Link href="/">{t("home")}</Link>
  </main>;
}
