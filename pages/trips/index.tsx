import withHead from "../@component/withHead"
import Trips from "./Trips"

const Index = () => {
  return <Trips />
}

export default withHead(Index, "여행 -Restay", "여행 페이지입니다.")
