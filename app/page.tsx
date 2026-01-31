// app/page.tsx
import HomeClient from "@/app/client/home-client";
import Container from "@/app/component/Container";
import { auth } from "@/auth";

const Home = async ({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) => {
  const session = await auth();
  const params = await searchParams;

  return (
    <Container>
      <HomeClient searchParams={params} sessionEmail={session?.user?.email ?? ""} />
    </Container>
  );
};

export default Home;
