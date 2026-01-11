import clientPromise from "@/app/api/mongoDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const id = body?.id;

    if (!id || typeof id !== "string" || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("Restay");

    const result = await db.collection("listings").findOne({ _id: new ObjectId(id) });

    if (!result) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ getListingInfo error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
