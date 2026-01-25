// app/api/chat/create-room/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  const myEmail = session?.user?.email;
  if (!myEmail) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { otherEmail } = await req.json();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  // MVP 용이라 anon으로도 가능하지만, 운영에서는 service role로 더 안전하게 처리하는 편이 많습니다.
  const supabase = createClient(url, anon);

  // 방 생성
  const { data: conv, error: convErr } = await supabase.from("conversations").insert({}).select("id").single();

  if (convErr) return NextResponse.json({ error: convErr.message }, { status: 500 });

  // 멤버 추가
  const { error: memErr } = await supabase.from("conversation_members").insert([
    { conversation_id: conv.id, user_email: myEmail },
    { conversation_id: conv.id, user_email: otherEmail },
  ]);

  if (memErr) return NextResponse.json({ error: memErr.message }, { status: 500 });

  return NextResponse.json({ conversationId: conv.id }, { status: 200 });
}
