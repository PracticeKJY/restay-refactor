// app/api/listings/getListings/route.ts
import clientPromise from "@/app/api/mongoDB";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ⭐ MongoDB는 반드시 nodejs

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("Restay");

    const result = await db
      .collection("listings")
      .find(body ?? {})
      .toArray();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ getListings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
