import { auth } from "@/auth";
import { pageMetadata } from "@/i18n/metadata";
import WishListCard from "@/app/wishList/WishListCard";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "/wishList", "wishlist", true);
}

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

export default WishList;
