// app/wishList/WishListCard.tsx (또는 기존 경로에 맞게)
import WishListCard from "@/app/wishList/WishListCard";
import Container from "../@component/Container";
import { auth } from "@/auth";

export const runtime = "nodejs";

export default async function WishListCardSC() {
  const session = await auth();

  return (
    <Container>
      <WishListCard sessionEmail={session?.user?.email ?? null} />
    </Container>
  );
}
