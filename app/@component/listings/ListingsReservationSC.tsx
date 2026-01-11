// app/@component/listings/ListingsReservationSC.tsx (Server)
import ListingsReservationClient from "@/app/@component/listings/ListingsReservation";
import { auth } from "@/auth";

type Props = {
  price: number;
  listingData: any;
};

export default async function ListingsReservationSC(props: Props) {
  const session = await auth();

  console.log(session?.user?.email, "이메일뭐라나오는데요?");

  return <ListingsReservationClient {...props} sessionEmail={session?.user?.email as string} />;
}
