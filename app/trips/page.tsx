// app/trips/page.tsx
import styles from "./Trips.module.css";
import { auth } from "@/auth";
import clientPromise from "@/app/api/mongoDB";
import Container from "@/app/@component/Container";
import Empty from "@/app/@component/Empty";
import Trips from "./Trips";
import { ReservationProps } from "@/types/reservation";
import { POST } from "@/app/@http/request";
import { reservationProductAtomProps } from "@/jotai/@store/state";

export const runtime = "nodejs";

export default async function Page() {
  // ✅ v5 방식 세션
  const session = await auth();

  if (!session?.user?.email) {
    return (
      <Container>
        <Empty title="로그인이 필요합니다" subtitle="예약 내역을 확인하려면 로그인해주세요." actionLabel="로그인" showReset />
      </Container>
    );
  }

  const res = await POST<reservationProductAtomProps[]>(`${process.env.NEXTAUTH_URL ?? ""}/api/trip`, {
    email: session.user.email,
  });

  const serializedResult = res.data.map((item) => ({
    ...item,
    _id: item.product._id.toString(),
  }));

  return (
    <Container>
      <div className={styles.tripsWrapper}>
        <div className={styles.tripsTitle}>예약확정내역</div>
        <div className={serializedResult.length > 0 ? styles.listingsContainer : ""}>
          {serializedResult.length > 0 ? (
            serializedResult.map((result) => <Trips key={String(result._id)} result={result} />)
          ) : (
            <Empty title="아직 예약된 여행이 없습니다!" subtitle="Restay와 함께 여행 계획을 세워보세요." actionLabel="숙소 검색하기" showReset />
          )}
        </div>
      </div>
    </Container>
  );
}
