import { useTranslations } from "next-intl";


import { Link } from "@/i18n/navigation"
import styles from "./Footer.module.css"

const FooterUl = () => {
  const t = useTranslations("Footer");

  const footerUlList = [
    t("aboutUs"),
    t("termsOfService"),
    t("privacyPolicy"),
    t("consumerDisputeResolution"),
    t("businessInformation"),
    t("restayMarketingCenter"),
    t("activityHostCenter"),
    t("contentIndustryDisclosures"),
  ]

  return (
    <ul className={styles.ulList}>
      {footerUlList.map((data, index) => {
        return (
          <li className={styles.liList} key={index}>
            <Link href="/">{data}</Link>
          </li>
        )
      })}
    </ul>
  )
}

export default FooterUl
