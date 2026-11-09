
import { useTranslations } from "next-intl";
import styles from "./Footer.module.css"

const FooterCSInfo = () => {
  const t = useTranslations("Footer");

  return (
    <p className={styles.serviceCenterInfo}>
      <b>{t("customerSupport01048742157")}</b>
      <span>{t("9AM3AM")}</span>
    </p>
  )
}

export default FooterCSInfo
