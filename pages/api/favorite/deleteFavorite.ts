import type { NextApiRequest, NextApiResponse } from "next"

import connectDB from "@/pages/api/mongoDB"

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { email, id } = req.body
    const db = (await connectDB).db("Restay")
    const result = await db
      .collection("favorite")
      .deleteMany({ email: email, id: id })

    return res.status(200).json(result)
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" })
  }
}

export default handler
