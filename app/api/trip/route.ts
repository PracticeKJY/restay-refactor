import clientPromise from "@/app/api/mongoDB";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const client = await clientPromise;
    const db = client.db("Restay");

    // const result = await db.collection("reservation").find({ email: session?.user?.email }).toArray();
    const result = await db.collection("reservation").find({ email }).toArray();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ deleteFavorites error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
