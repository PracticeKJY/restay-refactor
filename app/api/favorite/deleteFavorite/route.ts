// app/api/favorite/deleteFavorites/route.ts
import clientPromise from "@/app/api/mongoDB";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ⭐ MongoDB는 반드시 nodejs

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, id } = body;

    const client = await clientPromise;
    const db = client.db("Restay");

    const result = await db.collection("favorite").deleteMany({ email: email, id: id });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ deleteFavorites error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
