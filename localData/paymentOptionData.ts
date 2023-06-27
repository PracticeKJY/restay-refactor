import { FaApplePay } from "react-icons/fa"
import { AiOutlineCreditCard } from "react-icons/ai"
import { SiSamsungpay, SiKakao } from "react-icons/si"
import { BsPhone } from "react-icons/bs"

const paymentOptionData = [
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

export default paymentOptionData
