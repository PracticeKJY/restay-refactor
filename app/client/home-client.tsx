"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { FiArrowDown, FiArrowUpRight, FiCompass } from "react-icons/fi";
import { type fetchUrlatomProps, paymentTypeAtom } from "@/jotai/@store/state";
import { Link } from "@/i18n/navigation";
import Empty from "@/app/component/Empty";
import ListingsCard from "@/app/component/listings/ListingsCard";
import Categories from "@/app/component/Header/Categories";
import Search from "@/app/component/Header/Search";
import styles from "@/app/page.module.css";
interface HomeClientProps { searchParams: { category?: string }; sessionEmail?: string; initialListings: fetchUrlatomProps[]; }
export default function HomeClient({ searchParams, sessionEmail, initialListings }: HomeClientProps) {
  const t = useTranslations("HomeDesign");
  const common = useTranslations("Common");
  const locale = useLocale();
  const setType = useSetAtom(paymentTypeAtom);
  useEffect(() => { setType("mobilians_card"); }, [setType]);
  const category = searchParams?.category;
  const featured = initialListings[3] ?? initialListings[0];
  return <main className={styles.container}>
    {!category && <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span />{t("eyebrow")}</p>
        <h1 id="home-title">{t("titleLineOne")}<br /><span>{t("titleLineTwo")}</span></h1>
        <p className={styles.heroDescription}>{t("description")}</p>
        <a className={styles.primaryButton} href="#stays">{t("explore")}<FiArrowUpRight size={20} /></a>
        <div className={styles.heroNote}><span className={styles.noteIcon}><FiCompass size={22} /></span><p>{t("note")}<small>{t("noteDetail")}</small></p></div>
      </div>
      {featured && <Link href={`/listings/${featured._id}`} className={styles.heroVisual} aria-label={t("featuredStay")}>
        <Image src={featured.imageSrc[0]} alt={featured.title} fill priority sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1280px) 55vw, 720px" />
        <span className={styles.photoTag}>{t("photoTag")}</span>
        <div className={styles.photoCaption}><div><small>{t("featuredStay")}</small><strong>{featured.location.split(" ").slice(0, 2).join(" ")}</strong></div><span><FiArrowUpRight size={24} /></span></div>
      </Link>}
      <span className={styles.heroIndex}>01 / REST, YOUR WAY</span>
    </section>}
    <section className={styles.discovery} id="collections" aria-labelledby="discovery-title">
      <div><span className={styles.eyebrow}>{t("findYourStay")}</span><h2 id="discovery-title">{t("searchTitle")}</h2></div>
      <div className={styles.homeSearch}><Search prompt={t("searchPrompt")} /></div>
    </section>
    <div className={styles.categories}><Categories /></div>
    <section className={styles.stays} id="stays" aria-labelledby="stays-title">
      <div className={styles.sectionHeading}><div>
        <p className={styles.eyebrow}>{t("stayCollection")}</p>
        <h2 id="stays-title">{category ? common.rich("searchResult", {category: `'${category}'`, query: chunks => <span>{chunks}</span>}) : t("staysTitle")}</h2>
        <p className={styles.sectionDescription}>{category ? t("filteredDescription") : t("staysDescription")}</p>
      </div><span className={styles.resultCount}>{t("count", {count: initialListings.length.toLocaleString(locale)})}<FiArrowDown /></span></div>
      {category && <Link className={styles.resetLink} href="/">{t("reset")}</Link>}
      {initialListings.length === 0 ? <Empty showReset /> : <div className={styles.listingsContainer}>
        {initialListings.map((data, index) => <ListingsCard key={data._id} userId={data._id} data={data} sessionEmail={sessionEmail} priority={!!category && index === 0} />)}
      </div>}
    </section>
    <section className={styles.closing}><FiCompass size={30} /><div><h2>{t("closingTitle")}</h2><p>{t("closingDescription")}</p></div><a href="#collections">{t("findAgain")}<FiArrowUpRight /></a></section>
  </main>;
}
