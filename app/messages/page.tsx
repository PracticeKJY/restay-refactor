"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { Conversation } from "@/types/chat";

async function ensureSupabaseSession() {
  const { data } = await supabaseBrowser.auth.getSession();
  if (data.session) return;

  const res = await fetch("/api/session/supabase");
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error ?? "Failed to get supabase session");
  }

  await supabaseBrowser.auth.setSession({
    access_token: json.access_token,
    refresh_token: json.refresh_token,
  });
}

export default function MessagesPage() {
  const [list, setList] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // ✅ NextAuth 로그인 기반으로 Supabase 세션 세팅
        await ensureSupabaseSession();

        // ✅ 이제 토큰 없이도 RLS + Realtime 가능
        const { data, error } = await supabaseBrowser
          .from("conversations")
          .select("id, created_at, last_message_at, last_message_text")
          .order("last_message_at", { ascending: false, nullsFirst: false });

        if (error) {
          console.error("conversations select error:", error);
          setList([]);
        } else {
          setList((data ?? []) as Conversation[]);
        }
      } catch (e) {
        console.error(e);
        setList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div style={{ padding: 16 }}>로딩중...</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>메시지</h2>

      {list.length === 0 ? (
        <p>대화방이 없습니다.</p>
      ) : (
        <ul style={{ display: "grid", gap: 8, padding: 0, listStyle: "none" }}>
          {list.map((c) => (
            <li key={c.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
              <Link href={`/messages/${c.id}`} style={{ textDecoration: "none" }}>
                <div style={{ fontWeight: 600 }}>{c.last_message_text ?? "(메시지 없음)"}</div>
                <div style={{ opacity: 0.7, fontSize: 12 }}>{c.last_message_at ?? c.created_at}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
