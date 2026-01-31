//after

import DetailListingClient from "@/app/listings/[id]/DetailListingClient";
import { auth } from "@/auth";
import { DetailListingAtomProps } from "@/jotai/@store/state";

export const runtime = "nodejs";

interface ListingDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}
export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const session = await auth();

  const { id } = await params;

  const res = await fetch(`${process.env.NEXTAUTH_URL ?? ""}/api/listings/${id}`, {
    method: "GET",
  });

  // const res = await POST<DetailListingAtomProps>(`/api/listings/${id}`, JSON.stringify({ id }));

  const data = (await res.json()) as DetailListingAtomProps;

  const listingDataWithSession = {
    ...data,
    sessionEmail: session?.user?.email ?? "",
  };

  return <DetailListingClient sessionEmail={session?.user?.email ?? ""} listingData={data} />;
}
