import withHead from "@/pages/@component/withHead";
import MessageRoomPage from "@/app/messages/[id]/MessageRoomPage";

const Index = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  console.log(id, "params");
  return <MessageRoomPage params={{ id }} />;
};

export default withHead(Index, "예약 -Restay", "메세지 상세 페이지입니다.");
