import { getTranslations } from "next-intl/server";

export default async function Loading() {
  const t = await getTranslations("Common");
  return <div role="status" style={{ padding: "3rem 1rem", textAlign: "center" }}>{t("loading")}</div>;
}
