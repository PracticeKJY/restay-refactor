import type { NextApiRequest, NextApiResponse } from "next"

import connectDB from "@/pages/@lib/mongoDB"
import bcrypt from "bcrypt"

type Data = {
  email: string
  name: string
  password: string
}

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  if (req.method === "POST") {
    const hash = await bcrypt.hash(req.body.password, 10)
    req.body.password = hash

    const db = (await connectDB).db("Restay")
    const result = await db.collection("users").insertOne(req.body)
    res.redirect(302, "/")
  }
}
export default handler
