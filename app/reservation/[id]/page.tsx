import withHead from "@/pages/@component/withHead";
import Reservation from "./Reservation";
import { auth } from "@/auth";

const Index = async () => {
  const session = await auth();

  console.log(session?.user?.email, "이메일뭐라나오는데요?");

  return <Reservation sessionEmail={session?.user?.email ?? ""} />;
};

export default withHead(Index, "예약 -Restay", "예약 페이지입니다.");
