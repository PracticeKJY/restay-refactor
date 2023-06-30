import withHead from "@/pages/@component/withHead"
import Reservation from "./Reservation"

const Index = () => {
  return <Reservation />
}

export default withHead(Index, "예약 -Restay", "예약 페이지입니다.")
