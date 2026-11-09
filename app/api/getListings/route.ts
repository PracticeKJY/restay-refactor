// app/api/listings/getListings/route.ts
import { findListings } from "@/lib/listings";
import { NextResponse } from "next/server";

export const runtime = "nodejs"; // ⭐ MongoDB는 반드시 nodejs

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const result = await findListings(body ?? {});

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("❌ getListings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
