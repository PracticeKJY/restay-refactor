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

import { DetailListingAtom, endDateAtom, nextDateAtom, paymentTypeAtom, reservationProductAtom, reservationProductAtomProps, startDateAtom } from "../../../jotai/@store/state";

import { useAtom, useAtomValue } from "jotai";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";
import moment from "moment";
import { POST } from "@/app/@http/request";
import { PAYMENT_CONFIG, PaymentType } from "@/lib/portone-v1";

interface Props {
  sessionEmail: string | null;
}

declare global {
  interface Window {
    IMP?: any;
  }
}

const ReservationClient = ({ sessionEmail }: Props) => {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const detailListing = useAtomValue(DetailListingAtom);
  const startDate = useAtomValue(startDateAtom);
  const endDate = useAtomValue(endDateAtom);
  const nextDate = useAtomValue(nextDateAtom);

  const [reservationProduct, setReservationProduct] = useAtom(reservationProductAtom);
  const [type, setType] = useAtom(paymentTypeAtom);

  const paymentConfig = PAYMENT_CONFIG[type];

  const apiStartDay = moment(startDate).format("M.D");
  const apiEndDay = moment(endDate ?? nextDate).format("M.D");

  // 01.29 after) 결제 기능 추가로 주석 처리
  const onClickPay = async () => {
    // 로그인 체크 등 원하시는 조건을 먼저 처리
    // if (!sessionEmail) { ... }

    // 1) 스크립트 로드 확인
    if (!window.IMP) {
      toast.error("결제 모듈(IMP)이 아직 로드되지 않았습니다. 새로고침 후 다시 시도해주세요.");
      return;
    }

    // 2) 가맹점 식별코드 초기화 (포트원 콘솔에서 발급)
    window.IMP.init(process.env.NEXT_PUBLIC_PORTONE_IMP_CODE);

    // 3) 결제창 오픈
    window.IMP.request_pay(
      {
        channelKey: paymentConfig.channelKey,
        pay_method: "card",
        merchant_uid: `reservation_${Date.now()}`,
        name: "예약 결제",
        amount: 1,
        buyer_email: "qw1192@gmail.com",
        buyer_name: "테스트",
        buyer_tel: "010-4874-2157",
      },
      async (rsp: any) => {
        // rsp.success: 결제 성공 여부
        if (rsp.success) {
          // rsp.imp_uid / rsp.merchant_uid 등이 옴
          console.log("결제 성공:", rsp);
          // ✅ 실무 필수: 여기서 서버로 imp_uid/merchant_uid 보내서 결제 검증하세요
          // await fetch("/api/payment/complete", { method:"POST", body: JSON.stringify({ imp_uid: rsp.imp_uid, merchant_uid: rsp.merchant_uid }) })

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
            router.push("/");
          } catch (e) {
            toast.error("예약에 실패했어요.");
          }
        } else {
          console.log("결제 실패/취소:", rsp);
          toast.error(rsp.error_msg ?? "결제가 취소/실패했습니다.");
        }
      },
    );
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

          <Button label="예약 요청" onClick={onClickPay} />
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

// rsp response Example (200 OK)
// {
//     "success": true,
//     "imp_uid": "imp_639421859995",
//     "pay_method": "trans",
//     "merchant_uid": "reservation_1769663420897",
//     "name": "예약 결제",
//     "paid_amount": 1,
//     "currency": "KRW",
//     "pg_provider": "tosspay",
//     "pg_type": "payment",
//     "pg_tid": "09f69ee0-66a6-4b94-ba29-d86d51fcca51",
//     "apply_num": "",
//     "buyer_name": "테스트",
//     "buyer_email": "qw1192@gmail.com",
//     "buyer_tel": "010-4874-2157",
//     "buyer_addr": "",
//     "buyer_postcode": "",
//     "custom_data": null,
//     "status": "paid",
//     "paid_at": 1769663477,
//     "receipt_url": "",
//     "card_name": "",
//     "bank_name": "",
//     "card_quota": 0,
//     "card_number": ""
// }
