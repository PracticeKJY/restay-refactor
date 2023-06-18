import type { NextApiRequest, NextApiResponse } from "next"

import connectDB from "@/pages/@lib/mongoDB"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const db = (await connectDB).db("Restay")
    const result = await db.collection("favorite").insertOne(req.body)

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

export default handler
