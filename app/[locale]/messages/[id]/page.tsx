import { pageMetadata } from "@/i18n/metadata";
import MessageRoomPage from "@/app/messages/[id]/MessageRoomPage";
import { auth } from "@/auth";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  return pageMetadata(locale, `/messages/${encodeURIComponent(id)}`, "messages", true);
}

const Index = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const session = await auth();
  const email = session?.user?.email ?? null;
  return <MessageRoomPage key={`${id}:${email ?? "guest"}`} params={{ id }} currentUserEmail={email} />;
};

export default Index;
