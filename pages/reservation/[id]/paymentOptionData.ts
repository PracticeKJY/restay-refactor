import { FaAngleDown, FaApplePay } from "react-icons/fa"
import { AiOutlineCreditCard, AiOutlineCheck } from "react-icons/ai"
import { SiSamsungpay, SiKakao } from "react-icons/si"
import { BsPhone } from "react-icons/bs"
import { IconType } from "react-icons"

export const paymentOptionData = [
  {
    label: "신용카드 또는 체크카드",
    icon: AiOutlineCreditCard,
  },
  {
    label: "삼성페이",
    icon: SiSamsungpay,
  },
  {
    label: "애플페이",
    icon: FaApplePay,
  },
  {
    label: "카카오페이",
    icon: SiKakao,
  },
  {
    label: "휴대폰",
    icon: BsPhone,
  },
]
