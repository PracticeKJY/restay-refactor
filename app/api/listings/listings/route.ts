import clientPromise from "@/app/api/mongoDB";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type CreateListingBody = {
  title: string;
  description: string;
  imageSrc?: string[]; // 기존: string[] | undefined
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  location: string;
  price: string | number; // 기존에 parseInt(price, 10) 하므로 문자열도 허용
  latlngData: any;
  emailData: string; // 기존: users 조회에 사용
};

function isEmptyValue(v: unknown) {
  // 기존 로직: !req.body[value] 로 체크했는데, 0 같은 값도 false 처리되는 문제 있음
  // 아래는 "빈 값"만 걸러내고, 숫자 0은 허용하도록 개선한 체크입니다.
  if (v === null || v === undefined) return true;
  if (typeof v === "string" && v.trim() === "") return true;
  return false;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Partial<CreateListingBody>;

    // 1) 필수 필드 검증(기존 Object.keys(req.body) 방식 대신, 필요한 것만 명확히)
    const requiredKeys: (keyof CreateListingBody)[] = [
      "title",
      "description",
      "category",
      "roomCount",
      "bathroomCount",
      "guestCount",
      "location",
      "price",
      "latlngData",
      "emailData",
    ];

    for (const key of requiredKeys) {
      if (isEmptyValue(body[key])) {
        return NextResponse.json({ error: `Missing or invalid field: ${String(key)}` }, { status: 400 });
      }
    }

    // imageSrc는 선택(optional) 처리 (원하시면 requiredKeys에 넣으시면 됩니다)
    const { title, description, imageSrc, category, roomCount, bathroomCount, guestCount, location, price, latlngData, emailData } = body as CreateListingBody;

    const client = await clientPromise;
    const db = client.db("Restay");

    // 2) 유저 조회
    const user = await db.collection("users").findOne({ email: emailData });

    const userImage = user?.image ?? null;
    const userName = user?.name ?? null;

    // 3) 저장 데이터 구성
    const data = {
      title,
      description,
      imageSrc: imageSrc ?? [],
      category,
      roomCount: Number(roomCount),
      bathroomCount: Number(bathroomCount),
      guestCount: Number(guestCount),
      location,
      latlngData,
      price: typeof price === "string" ? parseInt(price, 10) : Number(price),
      userName,
      userImage,
      createdAt: new Date(),
    };

    if (!Number.isFinite(data.price)) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }

    // 4) insert
    const insertResult = await db.collection("listings").insertOne(data);

    // 5) 응답 (기존은 data만 내려줬는데, 실무에선 insertedId도 같이 주는 편이 편합니다)
    return NextResponse.json({ ...data, _id: insertResult.insertedId }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
