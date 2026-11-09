"use client"
import { useTranslations } from "next-intl";


const Loading = () => {
  const t = useTranslations("Common");

  return <div>{t("loading")}</div>
}

export default Loading
