import { StaticImageData } from "next/image";
import Toss_App_Icon from "@/public/Toss_App_Icon.png";
import KakaoPay_icon from "@/public/KakaoPay_icon.png";
import Card_Icon from "@/public/Card_Icon.png";
import Phone_icon from "@/public/Phone_icon.png";

export type PaymentType = "kakaopay" | "tosspayments" | "danal_phone" | "mobilians_card";

export type PortOneV1Config = {
  channelKey: string;
  pay_method: "card" | "pay" | "phone";
  displayName: string;
  icon: StaticImageData;
};

export const PAYMENT_CONFIG: Record<PaymentType, PortOneV1Config> = {
  kakaopay: {
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNELKEY_KAKAOPAY!,
    pay_method: "pay",
    displayName: "카카오페이",
    icon: KakaoPay_icon,
  },
  tosspayments: {
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNELKEY_TOSS!,
    pay_method: "pay",
    displayName: "토스페이먼츠",
    icon: Toss_App_Icon,
  },
  danal_phone: {
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNELKEY_PHONE!,
    pay_method: "phone",
    displayName: "휴대폰결제(다날)",
    icon: Phone_icon,
  },
  mobilians_card: {
    channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNELKEY_CARD!,
    pay_method: "card",
    displayName: "카드결제(모빌리언스)",
    icon: Card_Icon,
  },
};
