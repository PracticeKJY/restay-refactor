import { getTranslations } from "next-intl/server";

export default async function Loading() {
  const t = await getTranslations("Common");
  const design = await getTranslations("WorkspaceDesign");
  return <div data-ui="loading-shell" role="status" style={{ padding: "3rem 1rem", textAlign: "center" }}>
    <span>{t("loading")}</span><p data-ui="state-extra">{design("loadingDescription")}</p>
    <div data-ui="state-extra" aria-hidden="true"><div /><div /><div /></div>
  </div>;
}
