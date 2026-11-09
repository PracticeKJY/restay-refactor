import Reservation from "@/app/reservation/[id]/Reservation";
import { auth } from "@/auth";
import PortOneScript from "@/app/script/portone-script";
import { pageMetadata } from "@/i18n/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  return pageMetadata(locale, `/reservation/${encodeURIComponent(id)}`, "reservation", true);
}

const Index = async () => {
  const session = await auth();

  return <><PortOneScript /><Reservation sessionEmail={session?.user?.email ?? ""} /></>;
};

export default Index;
