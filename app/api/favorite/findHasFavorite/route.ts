// app/api/favorite/favorite/route.ts
import clientPromise from "@/app/api/mongoDB";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ⭐ MongoDB는 반드시 nodejs

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("Restay");
    const result = await db
      .collection("favorite")
      .find({ listingsId: { $exists: true } }, { projection: { email: 1, id: 1, _id: 0 } })
      .toArray();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ deleteFavorites error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
