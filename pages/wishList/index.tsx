import { GetServerSideProps } from "next"
import WishListCard from "./WishListCard"

export const getServerSideProps: GetServerSideProps<{
  repo: any
}> = async () => {
  const res = await fetch("https://api.github.com/repos/vercel/next.js")
  const repo = await res.json()

  return { props: { repo } }
}

const WishList = ({ repo }: any) => {
  return (
    <div>
      <WishListCard />
    </div>
  )
}

export default WishList
