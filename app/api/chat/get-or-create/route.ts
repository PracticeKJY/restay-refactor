import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import clientPromise from "@/app/api/mongoDB";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

type Body = {
  reservationId: string;
};

function toObjectIdIfValid(id: unknown) {
  const s = String(id ?? "");
  return ObjectId.isValid(s) ? new ObjectId(s) : null;
}

async function findOneAny<T>(db: any, collectionNames: string[], query: Record<string, any>): Promise<T | null> {
  for (const name of collectionNames) {
    const doc = await db.collection(name).findOne(query);
    if (doc) return doc as T;
  }
  return null;
}

export async function POST(req: Request) {
  // 1) 로그인 확인
  const session = await auth();
  const sessionEmail = session?.user?.email ? String(session.user.email) : null;
  if (!sessionEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2) body 파싱
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const reservationId = body?.reservationId?.trim();
  if (!reservationId) {
    return NextResponse.json({ error: "reservationId is required" }, { status: 400 });
  }
  if (!ObjectId.isValid(reservationId)) {
    return NextResponse.json({ error: "Invalid reservationId" }, { status: 400 });
  }
  const reservationObjectId = new ObjectId(reservationId);

  try {
    const client = await clientPromise;
    const db = client.db("Restay");

    // 3) 예약 조회 (컬렉션명 혼재 대비)
    const reservation = await findOneAny<any>(db, ["reservations", "reservation"], {
      _id: reservationObjectId,
    });

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
    }

    // 4) listingId 확보
    const listingIdRaw = reservation?.listingId ?? reservation?.product?._id ?? reservation?.product?.id;

    if (!listingIdRaw) {
      return NextResponse.json({ error: "Reservation missing listingId" }, { status: 500 });
    }

    const listingId = String(listingIdRaw);
    const listingObjectId = toObjectIdIfValid(listingId);

    // 5) listing 조회
    const listing = await findOneAny<any>(db, ["listings", "listing"], { _id: listingObjectId ?? listingId });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    const hostUserIdRaw = listing?.userId;
    if (!hostUserIdRaw) {
      return NextResponse.json({ error: "Listing missing host userId" }, { status: 500 });
    }
    const hostUserId = String(hostUserIdRaw);

    // 6) hostEmail 조회
    const hostUserObjectId = toObjectIdIfValid(hostUserId);

    const hostUser = await findOneAny<any>(db, ["users", "user"], { _id: hostUserObjectId ?? hostUserId });

    const hostEmail = hostUser?.email ? String(hostUser.email) : null;
    if (!hostEmail) {
      return NextResponse.json({ error: "Host email not found in users" }, { status: 500 });
    }

    // 7) guestEmail은 reservation에서 가져오는 것을 우선(없으면 세션)
    const reservationGuestEmail = reservation?.email ? String(reservation.email) : null;
    const guestEmail = reservationGuestEmail ?? sessionEmail;

    // 8) 권한 체크: 예약 당사자(게스트) 또는 호스트만 허용
    const isHost = sessionEmail === hostEmail;
    const isGuest = sessionEmail === guestEmail;

    if (!isHost && !isGuest) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 9) Supabase get-or-create (reservation_id 유니크)
    const supabase = supabaseAdmin();

    const { data: conv, error: convErr } = await supabase
      .from("conversations")
      .upsert(
        {
          reservation_id: reservationId,
          listing_id: listingId,
          // host_user_id: hostUserId,
          host_email: hostEmail,
          guest_email: guestEmail,
          last_message_at: null,
          last_message_text: null,
        },
        { onConflict: "reservation_id" },
      )
      .select("id")
      .single();

    if (convErr || !conv) {
      return NextResponse.json({ error: convErr?.message ?? "Failed to upsert conversation" }, { status: 500 });
    }

    // 10) 멤버 등록
    const { error: memErr } = await supabase.from("conversation_members").upsert(
      [
        { conversation_id: conv.id, user_email: hostEmail },
        { conversation_id: conv.id, user_email: guestEmail },
      ],
      { onConflict: "conversation_id,user_email" },
    );

    if (memErr) {
      return NextResponse.json({ error: memErr.message }, { status: 500 });
    }

    return NextResponse.json({ conversationId: conv.id }, { status: 200 });
  } catch (e) {
    console.error("❌ get-or-create error:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
