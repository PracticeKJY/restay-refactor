import type { NextApiRequest, NextApiResponse } from "next"

import connectDB from "@/pages/api/mongoDB"

type Data = {
  category: string
  locationValue: string
  guestCount: number
  roomCount: number
  bathroomCount: number
  imageSrc: string[] | undefined
  price: number
  title: string
  description: string
}

import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    // delete req.body.emailData
    // const locationValue = req.body.location?.value
    // delete req.body.location
    // const modifiedReqBody = { locationValue, ...req.body }

    const {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      location,
      price,
    } = req.body

    Object.keys(req.body).forEach((value: any) => {
      if (!req.body[value]) {
        return res.status(500)
      }
    })

    let db = (await connectDB).db("Restay")
    let result = await db
      .collection("users")
      .findOne({ email: req.body.emailData })

    const userId = result?._id
    // const data = { modifiedReqBody, userId, createdAt: new Date() }
    const data = {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.value,
      price: parseInt(price, 10),
      userId: userId,
      createdAt: new Date(),
    }

    let insertDB = await db.collection("listings").insertOne(data)

    return res.status(200).json(data)
  } catch (error) {
    return res.status(500)
  }
}

export default handler

// _id를 가지고 DB 조회하는 코드
// let result2 = await db
//   .collection("users")
//   .findOne({ _id: new ObjectId(result?._id) })
//   console.log(result2, "리설트2")

//백업코드1
// try {
//   delete req.body.emailData
//   const locationValue = req.body.location?.value
//   delete req.body.location
//   const modifiedReqBody = { locationValue, ...req.body }

//   let db = (await connectDB).db("Restay")
//   let result = await db
//     .collection("users")
//     .findOne({ email: req.body.emailData })

//   const userId = result?._id
//   const data = { modifiedReqBody, userId, createdAt: new Date() }

//   let insertDB = await db.collection("listings").insertOne(data)

//   return res.status(200).json(modifiedReqBody)
// } catch (error) {
//   return res.status(500)
// }
