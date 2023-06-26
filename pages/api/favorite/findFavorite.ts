import type { NextApiRequest, NextApiResponse } from "next"

import connectDB from "@/pages/api/mongoDB"
import { authOptions } from "pages/api/auth/[...nextauth]"
import { getServerSession } from "next-auth/next"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  if (session) {
    try {
      const db = (await connectDB).db("Restay")
      const result = await db
        .collection("favorite")
        .aggregate([
          {
            $addFields: { listingsId: { $toObjectId: "$id" } },
          },
          {
            $lookup: {
              from: "listings",
              localField: "listingsId",
              foreignField: "_id",
              as: "favoriteData",
            },
          },
          {
            $merge: {
              into: "favorite",
              on: "_id",
              whenMatched: "merge",
              whenNotMatched: "insert",
            },
          },
        ])
        .toArray()

      const findData = await db.collection("favorite").find().toArray()

      // 새로고침하면 무한로딩(박대기 상태)에 걸림
      //  = SQL 조인 개념 (2개의 컬렉션의 교집합)
      // 대안방법 1. Database 교체
      // 2. 컬렉션안에 데이터들을 모두 집어넣고 과정생략
      // const favoriteData = await Promise.all(
      //   filterResult.map(async (data) => {
      //     return await db.collection("listings").findOne({
      //       _id: new ObjectId(data.toFindwishListData.id),
      //     })
      //   }),
      // )
      // const duplicateFavoriteData: any = favoriteData.filter((data, index) => {
      //   const i = favoriteData.findIndex((value) => value?.id === data?.id)
      //   return i === index
      // })

      return res.status(200).json(findData)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export default handler
