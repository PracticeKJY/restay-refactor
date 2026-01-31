import withHead from "@/app/component/withHead";
import Reservation from "./Reservation";
import { auth } from "@/auth";

const Index = async () => {
  const session = await auth();

  return <Reservation sessionEmail={session?.user?.email ?? ""} />;
};

export default withHead(Index, "예약 -Restay", "예약 페이지입니다.");
