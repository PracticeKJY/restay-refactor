// app/api/messages/send/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function supabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
}

type Body = {
  conversationId: string;
  text: string;
};

export async function POST(req: Request) {
  const session = await auth();
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const conversationId = body?.conversationId?.trim();
  const text = body?.text?.trim();

  if (!conversationId) {
    return NextResponse.json({ error: "conversationId is required" }, { status: 400 });
  }
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const supabase = supabaseAdmin();

  // ✅ 멤버인지 확인 (호스트/게스트 둘 다)
  const { data: member, error: memberErr } = await supabase
    .from("conversation_members")
    .select("conversation_id, user_email")
    .eq("conversation_id", conversationId)
    .eq("user_email", email)
    .maybeSingle();

  if (memberErr) {
    return NextResponse.json({ error: memberErr.message }, { status: 500 });
  }
  if (!member) {
    return NextResponse.json({ error: "Forbidden (not a member)" }, { status: 403 });
  }

  // ✅ messages insert (service_role이라 RLS 무시됨)
  const { data: inserted, error: insErr } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_email: email,
      text,
    })
    .select("id")
    .single();

  if (insErr) {
    return NextResponse.json({ error: insErr.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: inserted.id }, { status: 200 });
}
