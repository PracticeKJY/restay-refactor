// app/reservation/[id]/ReservationSC.tsx
import Reservation from "@/app/reservation/[id]/Reservation";
import { auth } from "@/auth";

export const runtime = "nodejs";

export default async function ReservationSC() {
  const session = await auth();

  return <Reservation sessionEmail={session?.user?.email ?? null} />;
}
