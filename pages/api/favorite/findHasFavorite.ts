import type { NextApiRequest, NextApiResponse } from "next"

import connectDB from "@/pages/@lib/mongoDB"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const db = (await connectDB).db("Restay")
    const result = await db
      .collection("favorite")
      .find(
        { "listingsId": { $exists: true } },
        { projection: { email: 1, id: 1, _id: 0 } },
      )
      .toArray()

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

export default handler
