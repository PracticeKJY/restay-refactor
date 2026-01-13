// 예: app/listings/[id]/page.tsx (Server)
import FavoriteButton from "@/app/@component/listings/FavoriteButton";
import { auth } from "@/auth";

export default async function FavoriteButtonSC({ data }: { data: any }) {
  const session = await auth();

  return <FavoriteButton data={data} sessionEmail={session?.user?.email ?? null} />;
}
