export type PaymentType = "kakaopay" | "tosspayments" | "danal_phone" | "mobilians_card";

export type PortOneV1Config = {
  channelKey: string;
  pay_method: "card" | "pay" | "phone";
  displayName: string;
};

export const PAYMENT_CONFIG: Record<PaymentType, PortOneV1Config> = {
  kakaopay: {
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNELKEY_KAKAOPAY!,
    pay_method: "pay",
    displayName: "카카오페이",
  },
  tosspayments: {
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNELKEY_TOSS!,
    pay_method: "pay",
    displayName: "토스페이먼츠",
  },
  danal_phone: {
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNELKEY_PHONE!,
    pay_method: "phone",
    displayName: "휴대폰결제(다날)",
  },
  mobilians_card: {
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNELKEY_CARD!,
    pay_method: "card",
    displayName: "카드결제(모빌리언스)",
  },
};
