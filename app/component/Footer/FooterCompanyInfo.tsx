
import { useTranslations } from "next-intl";
const FooterCompanyInfo = () => {
  const t = useTranslations("Footer");

  return (
    <address>
      <div>{t("restayCompanyLtd")}</div>
      <br />
      <div>
        {t("address5F57GarakRo21Gil")}</div>
      <div>
        {t("eCommerceRegistration4024SeoulGangnam01234")}</div>
      <div>
        {t("restayCompanyLtdActsAsAnIntermediary")}</div>
      <br />
      Copyright GC COMPANY Corp. All rights reserved.
    </address>
  )
}

export default FooterCompanyInfo
