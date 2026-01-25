// app/api/chat/token/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import crypto from "crypto";

export const runtime = "nodejs";

function base64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

// HS256 JWT 생성(외부 라이브러리 없이)
// - Supabase는 Project JWT Secret으로 서명된 토큰을 신뢰합니다.
function signJwtHS256(payload: Record<string, unknown>, secret: string) {
  const header = { alg: "HS256", typ: "JWT" };

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const signature = crypto.createHmac("sha256", secret).update(data).digest();
  const encodedSig = base64url(signature);

  return `${data}.${encodedSig}`;
}

export async function GET() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    alert("이메일없어");
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jwtSecret = process.env.SUPABASE_JWT_SECRET;
  if (!jwtSecret) {
    return NextResponse.json({ error: "Missing SUPABASE_JWT_SECRET" }, { status: 500 });
  }

  // 토큰 만료(예: 10분) — 짧게 권장
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 60 * 10;

  // 여기서는 RLS에서 auth.jwt()->>'email'로 판별하므로 email 클레임이 핵심입니다.
  // sub는 아무 문자열이어도 되지만, UUID 형태면 더 깔끔합니다.
  const payload = {
    aud: "authenticated",
    role: "authenticated",
    iss: "nextauth-restay",
    sub: crypto.randomUUID(),
    email,
    iat: now,
    exp,
  };

  const token = signJwtHS256(payload, jwtSecret);

  return NextResponse.json({ token, exp }, { status: 200 });
}
