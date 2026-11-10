// app/page.tsx
import HomeClient from "@/app/client/home-client";
import { auth } from "@/auth";
import { pageMetadata } from "@/i18n/metadata";
import { findListings } from "@/lib/listings";
import type { fetchUrlatomProps } from "@/jotai/@store/state";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "/", "home");
}

const Home = async ({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) => {
  const session = await auth();
  const params = await searchParams;
  // Match the API JSON serialization, including ObjectId and Date fields.
  const initialListings: fetchUrlatomProps[] = JSON.parse(JSON.stringify(await findListings(params)));

  return (
      <HomeClient searchParams={params} sessionEmail={session?.user?.email ?? ""} initialListings={initialListings} />
  );
};

export default Home;
