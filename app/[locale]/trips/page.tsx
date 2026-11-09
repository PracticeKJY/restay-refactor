import { getTranslations } from "next-intl/server";
// app/trips/page.tsx
import styles from "@/app/trips/Trips.module.css";
import { auth } from "@/auth";
import Container from "@/app/component/Container";
import Empty from "@/app/component/Empty";
import Trips from "@/app/trips/Trips";
import { POST } from "@/app/http/request";
import { reservationProductAtomProps } from "@/jotai/@store/state";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "/trips", "trips", true);
}

export const runtime = "nodejs";

type TripRecord = reservationProductAtomProps & { _id: string };

export default async function Page() {
  const t = await getTranslations("Common");

  // ✅ v5 방식 세션
  const session = await auth();
  const currentUserEmail = session?.user?.email;

  if (!currentUserEmail) {
    return (
      <Container>
        <Empty title={t("pleaseLogIn")} subtitle={t("logInToViewYourReservations")} actionLabel={t("logIn")} showReset />
      </Container>
    );
  }

  const res = await POST<TripRecord[]>(`${process.env.NEXTAUTH_URL!}/api/trip`, {
    // const res = await POST<reservationProductAtomProps[]>(`/api/trip`, {
    email: currentUserEmail,
  });

  const serializedResult = res.data.map((item) => ({
    ...item,
    reservationId: String(item._id),
    _id: item.product._id.toString(),
  }));

  return (
    <Container>
      <div className={styles.tripsWrapper}>
        <div className={styles.tripsTitle}>{t("confirmedReservations")}</div>
        <div className={serializedResult.length > 0 ? styles.listingsContainer : ""}>
          {serializedResult.length > 0 ? (
            serializedResult.map((result) => <Trips key={result.reservationId} result={result} reservationId={result.reservationId} currentUserEmail={currentUserEmail} />)
          ) : (
            <Empty title={t("noTripsBookedYet")} subtitle={t("planYourNextTripWithRestay")} actionLabel={t("findAStay")} showReset />
          )}
        </div>
      </div>
    </Container>
  );
}
