// app/home-client.tsx
"use client";

import styles from "@/app/page.module.css";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { fetchUrlAtom, fetchUrlatomProps } from "@/jotai/@store/state";
import Spinner from "@/app/@component/Spinner/Spinner";
import Empty from "@/app/@component/Empty";
import ListingsCard from "@/app/@component/listings/ListingsCard";
import { POST } from "@/app/@http/request";

interface HomeClientProps {
  searchParams: {
    category?: string;
  };
  sessionEmail?: string;
}

export default function HomeClient({ searchParams, sessionEmail }: HomeClientProps) {
  const [fetchUrl, setFetchUrl] = useAtom(fetchUrlAtom);
  const [isLoading, setIsLoading] = useState(true);

  const category = searchParams?.category;

  useEffect(() => {
    const getListing = async () => {
      try {
        setIsLoading(true);
        const res = await POST<fetchUrlatomProps[]>("/api/getListings", searchParams);
        setFetchUrl(res.data);
      } catch (e) {
        // 필요하면 toast 처리
      } finally {
        setIsLoading(false);
      }
    };

    getListing();
  }, [JSON.stringify(searchParams), setFetchUrl]);

  const searchResult = category ? (
    <div className={styles.searchResult}>
      <span className={styles.routerQuery}>{`'${category}'`}</span>에 대한 검색결과
    </div>
  ) : null;

  if (isLoading) return <Spinner />;

  if (!fetchUrl || fetchUrl.length === 0) return <Empty showReset />;

  return (
    <div className={styles.container}>
      {searchResult}
      <div className={styles.listingsContainer}>
        {fetchUrl.map((data: any) => (
          <ListingsCard key={data._id} userId={data._id} data={data} sessionEmail={sessionEmail} />
        ))}
      </div>
    </div>
  );
}
