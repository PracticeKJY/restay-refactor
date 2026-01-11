import withHead from "../@component/withHead"
import WishListCard from "./WishListCard"

// import { GetServerSideProps } from "next"
// export const getServerSideProps: GetServerSideProps<{
//   repo: any
// }> = async () => {
//   const res = await fetch("https://api.github.com/repos/vercel/next.js")
//   const repo = await res.json()

//   return { props: { repo } }
// }

const WishList = () => {
  return (
    <div>
      <WishListCard />
    </div>
  )
}

export default withHead(
  WishList,
  "위시리스트 -Restay",
  "위시리스트 페이지입니다.",
)
