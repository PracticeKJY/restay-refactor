import styles from "./Trips.module.css";
import { GetServerSidePropsContext } from "next";
import withHead from "../@component/withHead";
import Trips from "./Trips";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import connectDB from "../api/mongoDB";
import { ReservationProps } from "@/types/reservation";
import Empty from "../@component/Empty";
import Container from "../@component/Container";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  const db = (await connectDB).db("Restay");
  const result = await db.collection("reservation").find({ email: session?.user?.email }).toArray();

  const serializedResult = result.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  return {
    props: { serializedResult },
  };
};

const Index = ({ serializedResult }: { serializedResult: ReservationProps[] }) => {
  return (
    <Container>
      <div className={styles.tripsWrapper}>
        <div className={styles.tripsTitle}>예약확정내역</div>
        <div className={serializedResult.length > 0 ? styles.listingsContainer : ""}>
          {serializedResult.length > 0 ? (
            serializedResult.map((result) => {
              return <Trips key={result._id.toString()} result={result} />;
            })
          ) : (
            <Empty title="아직 예약된 여행이 없습니다!" subtitle="Restay와 함께 여행 계획을 세워보세요." actionLabel="숙소 검색하기" showReset />
          )}
        </div>
      </div>
    </Container>
  );
};

export default withHead(Index, "여행 -Restay", "여행 페이지입니다.");
