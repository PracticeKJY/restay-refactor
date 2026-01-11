import styles from "./index_old.module.css";
import Container from "./@component/Container";
import { useEffect, useState } from "react";
import ListingsCard from "./@component/listings/ListingsCard";
import { useAtom } from "jotai";
import { fetchUrlAtom } from "../jotai/@store/state";
import axios from "axios";
import { useRouter } from "next/router";
import Empty from "./@component/Empty";
import Spinner from "./Spinner";

const ListingCard = () => {
  const [fetchUrl, setFetchUrl] = useAtom(fetchUrlAtom);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getListing = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post("/api/listings/getListings", router.query);
        const data = response.data;
        setFetchUrl(data);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    getListing();
  }, [router.query]);

  const routerQuery = router.query.category;
  const searchResult = routerQuery ? (
    <div className={styles.searchResult}>
      <span className={styles.routerQuery}>{`'${routerQuery}'`}</span>에 대한 검색결과
    </div>
  ) : (
    ""
  );

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : fetchUrl.length > 0 ? (
        <div className={styles.container}>
          {searchResult}
          <div className={styles.listingsContainer}>
            {fetchUrl.map((data: any) => {
              return <ListingsCard key={data._id} userId={data._id} data={data} />;
            })}
          </div>
        </div>
      ) : (
        <Empty showReset />
      )}
    </>
  );
};

export default function Home() {
  return (
    <>
      <Container>
        <ListingCard />
      </Container>
    </>
  );
}
