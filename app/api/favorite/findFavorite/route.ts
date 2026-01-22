// app/api/favorite/route.ts (예시)
import { NextResponse } from "next/server";
import clientPromise from "@/app/api/mongoDB";
import { auth } from "@/auth"; // ⭐ v5 핵심

export const runtime = "nodejs";

export async function GET() {
  // ✅ v5 방식
  const session = await auth();

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("Restay");

    const userEmail = session.user.email;

    const data = await db
      .collection("favorite")
      .aggregate([
        // ✅ 유저별 필터 (보안 필수)
        { $match: { email: userEmail } },

        // string id → ObjectId 변환 (안전)
        {
          $addFields: {
            listingsId: {
              $convert: {
                input: "$id",
                to: "objectId",
                onError: null,
                onNull: null,
              },
            },
          },
        },
        { $match: { listingsId: { $ne: null } } },

        // listings 조인
        {
          $lookup: {
            from: "listings",
            localField: "listingsId",
            foreignField: "_id",
            as: "listing",
          },
        },
        { $unwind: "$listing" },

        // 반환 필드 제한 (성능/보안)
        // {
        //   $project: {
        //     _id: 1,
        //     id: 1,
        //     userEmail: 1,
        //     createdAt: 1,
        //     listing: 1,
        //   },
        // },
      ])
      .toArray();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("❌ getFavorites error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
