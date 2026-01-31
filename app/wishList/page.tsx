import { auth } from "@/auth";
import withHead from "../component/withHead";
import WishListCard from "./WishListCard";

// import { GetServerSideProps } from "next"
// export const getServerSideProps: GetServerSideProps<{
//   repo: any
// }> = async () => {
//   const res = await fetch("https://api.github.com/repos/vercel/next.js")
//   const repo = await res.json()

//   return { props: { repo } }
// }

const WishList = async () => {
  const session = await auth();

  // const res = await fetch(`${process.env.NEXTAUTH_URL ?? ""}/api/listings/${id}`, {
  //   method: "GET",
  // });

  return (
    <div>
      <WishListCard />
    </div>
  );
};

export default withHead(WishList, "위시리스트 -Restay", "위시리스트 페이지입니다.");
