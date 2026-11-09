import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function pageMetadata(locale: string, path: string, title: string, privatePage = false): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const korean = path === "/" ? "/" : path;
  const english = `/en${path === "/" ? "" : path}`;
  const canonical = locale === "en" ? english : korean;
  return {
    title: `${t(title)} - Restay`,
    description: t("description"),
    alternates: { canonical, languages: { ko: korean, en: english, "x-default": korean } },
    openGraph: { title: `${t(title)} - Restay`, description: t("description"), url: canonical, locale: locale === "en" ? "en_US" : "ko_KR" },
    ...(privatePage ? { robots: { index: false, follow: false } } : {}),
  };
}
