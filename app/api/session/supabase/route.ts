import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

function supabaseAdmin() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
}

function supabaseAnon() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, { auth: { persistSession: false, autoRefreshToken: false } });
}

// NextAuth 로그인 사용자를 "Supabase Auth 세션"으로 변환해서 내려줌
export async function GET() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = supabaseAdmin();
  const anon = supabaseAnon();

  // 1) magiclink 생성(유저 없으면 생성까지 해줌)
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email,
  });

  if (linkErr || !linkData?.properties?.hashed_token) {
    return NextResponse.json({ error: linkErr?.message ?? "Failed to generate link" }, { status: 500 });
  }

  // 2) token_hash로 verify → 세션 발급(= Supabase가 인정하는 access_token)
  const { data: verified, error: verifyErr } = await anon.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: "email", // 중요: token_hash 방식은 type: "email"
  });

  if (verifyErr || !verified?.session) {
    return NextResponse.json({ error: verifyErr?.message ?? "Failed to verify otp" }, { status: 500 });
  }

  // 프론트에서 setSession 할 수 있도록 그대로 내려줌
  return NextResponse.json(
    {
      access_token: verified.session.access_token,
      refresh_token: verified.session.refresh_token,
      expires_at: verified.session.expires_at,
      user: verified.user,
    },
    { status: 200 },
  );
}
