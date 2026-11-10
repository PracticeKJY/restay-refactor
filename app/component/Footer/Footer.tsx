import styles from "./Footer.module.css"

import Container from "../Container"
import FooterUl from "./FooterUl"
import FooterCompanyInfo from "./FooterCompanyInfo"
import FooterIconList from "./FooterIconList"
import FooterCSInfo from "./FooterCSInfo"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { useTranslations } from "next-intl"

const Footer = () => {
  const t = useTranslations("Footer")
  return (
    <footer data-ui="footer" className={styles.footerContainer}>
      <Container>
        <div data-ui="footer-intro" className={styles.footerIntro}>
          <div><Link href="/" aria-label="Restay"><Image src="/mainLogo.svg" alt="Restay" width={100} height={50} /></Link><p>{t("brandDescription")}</p></div>
          <div><span>{t("stayInspired")}</span><h2>{t("brandTagline")}</h2></div>
        </div>
        <FooterUl />
        <FooterCSInfo />
        <FooterCompanyInfo />
        <FooterIconList />
      </Container>
    </footer>
  )
}

export default Footer
