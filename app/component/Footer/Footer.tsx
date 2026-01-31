"use client"

import styles from "./Footer.module.css"

import Container from "../Container"
import FooterUl from "./FooterUl"
import FooterCompanyInfo from "./FooterCompanyInfo"
import FooterIconList from "./FooterIconList"
import FooterCSInfo from "./FooterCSInfo"

const Footer = () => {
  return (
    <footer className={styles.footerContainer}>
      <Container>
        <FooterUl />
        <FooterCSInfo />
        <FooterCompanyInfo />
        <FooterIconList />
      </Container>
    </footer>
  )
}

export default Footer
