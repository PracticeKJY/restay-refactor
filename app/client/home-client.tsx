// app/home-client.tsx
"use client";
import { useTranslations } from "next-intl";


import styles from "@/app/page.module.css";
import { useEffect } from "react";
import { useSetAtom } from "jotai";
import { type fetchUrlatomProps, paymentTypeAtom } from "@/jotai/@store/state";
import Empty from "@/app/component/Empty";
import ListingsCard from "@/app/component/listings/ListingsCard";

interface HomeClientProps {
  searchParams: {
    category?: string;
  };
  sessionEmail?: string;
  initialListings: fetchUrlatomProps[];
}

export default function HomeClient({ searchParams, sessionEmail, initialListings }: HomeClientProps) {
  const t = useTranslations("Common");

  const setType = useSetAtom(paymentTypeAtom);

  useEffect(() => {
    setType("mobilians_card");
  }, []);

  const category = searchParams?.category;

  const searchResult = category ? (
    <div className={styles.searchResult}>
      {t.rich("searchResult", { category: `'${category}'`, query: (chunks) => <span className={styles.routerQuery}>{chunks}</span> })}</div>
  ) : null;

  if (initialListings.length === 0) return <Empty showReset />;

  return (
    <div className={styles.container}>
      {searchResult}
      <div className={styles.listingsContainer}>
        {initialListings.map((data, index) => (
          <ListingsCard key={data._id} userId={data._id} data={data} sessionEmail={sessionEmail} priority={index === 0} />
        ))}
      </div>
    </div>
  );
}
