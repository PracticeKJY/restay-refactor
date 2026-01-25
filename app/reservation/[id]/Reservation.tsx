"use client";

import styles from "./Reservation.module.css";

import Container from "@/app/@component/Container";
import Button from "@/app/@component/Button";
import Info from "./Info";
import Payment from "./Payment";
import Refund from "./Refund";
import Rule from "./Rule";
import ProductCardInfo from "./ProductCard";
import PriceInfo from "./PriceInfo";

import { DetailListingAtom, endDateAtom, nextDateAtom, reservationProductAtom, reservationProductAtomProps, startDateAtom } from "../../../jotai/@store/state";

import { useAtom, useAtomValue } from "jotai";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import moment from "moment";
import { POST } from "@/app/@http/request";

interface Props {
  sessionEmail: string | null;
}

const ReservationClient = ({ sessionEmail }: Props) => {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const detailListing = useAtomValue(DetailListingAtom);
  const startDate = useAtomValue(startDateAtom);
  const endDate = useAtomValue(endDateAtom);
  const nextDate = useAtomValue(nextDateAtom);

  const [reservationProduct, setReservationProduct] = useAtom(reservationProductAtom);

  const apiStartDay = moment(startDate).format("M.D");
  const apiEndDay = moment(endDate ?? nextDate).format("M.D");

  const onClick = async () => {
    if (!sessionEmail) {
      toast.error("로그인 후 이용해주세요.");
      return;
    }

    try {
      const payload = {
        product: detailListing,
        startDay: apiStartDay,
        endDay: apiEndDay,
        email: sessionEmail,
      };

      // 1) 예약 생성
      const res = await POST<any>("/api/reservation", payload);

      // ✅ 2) 예약 성공 후: reservationId 뽑기 (필드명은 아래 중 하나일 가능성이 큼)
      const reservationId = res?.data?.insertedId;

      if (!reservationId) {
        console.warn("예약 id가 응답에 없습니다. 채팅방을 생성할 수 없습니다.", res?.data);
      } else {
        // ✅ 3) 예약 성공 직후: 채팅방 자동 생성
        const chatRes = await fetch("/api/chat/get-or-create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include", // ⭐⭐⭐ 중요: NextAuth 쿠키 포함
          body: JSON.stringify({ reservationId: String(reservationId) }),
        });

        const chatJson = await chatRes.json();

        if (!chatRes.ok) {
          console.error("채팅방 생성 실패:", chatJson);
        } else {
          console.log("채팅방 생성 완료:", chatJson.conversationId);
          // 원하면 여기서 바로 메시지 페이지로 이동도 가능:
          // router.push(`/messages/${chatJson.conversationId}`);
        }
      }

      console.log(res.data, "resresresrserserser");

      toast.success("예약되었습니다.");
      // router.push("/");
    } catch (e) {
      toast.error("예약에 실패했어요.");
    }
  };

  return (
    <Container>
      <div className={styles.reservationContainer}>
        <div className={styles.reservationInfo}>
          <div className={styles.title}>예약 요청</div>

          <Info startDate={startDate} endDate={endDate ?? nextDate} />
          <Payment />
          <Refund />
          <Rule />

          <Button label="예약 요청" onClick={onClick} />
        </div>

        <div className={styles.productCardContainer}>
          <div className={styles.productCardWrapper}>
            <ProductCardInfo detailListing={detailListing} />
            <div className={styles.priceInfoHeading}>요금 세부 정보</div>
            <PriceInfo price={detailListing.price} startDate={startDate} endDate={endDate ?? nextDate} />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ReservationClient;
