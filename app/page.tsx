// app/page.tsx
import HomeClient from "@/app/@client/home-client";
import Container from "@/app/@component/Container";

const Home = async ({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) => {
  const params = await searchParams;

  return (
    <Container>
      <HomeClient searchParams={params} />
    </Container>
  );
};

export default Home;
