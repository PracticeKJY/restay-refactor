// 예: app/listings/[id]/page.tsx (Server)
import FavoriteButton from "@/app/@component/listings/FavoriteButton";
import { auth } from "@/auth";

export default async function FavoriteButtonSC({ data }: { data: any }) {
  const session = await auth();

  // data는 기존처럼 가져왔다고 가정
  return <FavoriteButton data={data} sessionEmail={session?.user?.email ?? null} />;
}
