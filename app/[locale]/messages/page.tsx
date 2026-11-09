import MessagePage from "@/app/messages/MessagePage";
import { pageMetadata } from "@/i18n/metadata";
import { auth } from "@/auth";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "/messages", "messages", true);
}

export default async function Page() {
  const session = await auth();
  const email = session?.user?.email ?? null;
  return <MessagePage key={email ?? "guest"} currentUserEmail={email} />;
}
