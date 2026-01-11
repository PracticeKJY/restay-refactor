import type { NextApiRequest, NextApiResponse } from "next";

import connectDB from "@/pages/api/mongoDB";

type Data = {
  category: string;
  location: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  imageSrc: string[] | undefined;
  price: number;
  title: string;
  description: string;
  latlngData: any;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  try {
    const { title, description, imageSrc, category, roomCount, bathroomCount, guestCount, location, price, latlngData } = req.body;

    Object.keys(req.body).forEach((value: any) => {
      if (!req.body[value]) {
        return res.status(500);
      }
    });

    let db = (await connectDB).db("Restay");
    let result = await db.collection("users").findOne({ email: req.body.emailData });

    const userImage = result?.image;
    const userName = result?.name;
    const data = {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      location,
      latlngData,
      price: parseInt(price, 10),
      userName,
      userImage,
      createdAt: new Date(),
    };

    let insertDB = await db.collection("listings").insertOne(data);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500);
  }
};

export default handler;
