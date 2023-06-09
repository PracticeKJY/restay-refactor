import type { NextApiRequest, NextApiResponse } from "next"

import connectDB from "@/pages/api/mongoDB"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.body) {
    try {
      const db = (await connectDB).db("Restay")
      const result = await db.collection("listings").find(req.body).toArray()

      return res.status(200).json(result)
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" })
    }
  }
}

export default handler
