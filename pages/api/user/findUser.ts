import type { NextApiRequest, NextApiResponse } from "next"

import connectDB from "@/pages/@lib/mongoDB"
import { ObjectId } from "mongodb"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const db = (await connectDB).db("Restay")
    const result = await db
      .collection("users")
      .findOne({ _id: new ObjectId(req.body.id) })

    console.log(result, "바디스")
    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

export default handler
