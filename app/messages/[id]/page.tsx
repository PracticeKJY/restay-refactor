"use client";

import { useEffect, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import type { Message } from "@/types/chat";

type Props = { params: { id: string } };

async function ensureSupabaseSession() {
  const { data } = await supabaseBrowser.auth.getSession();
  if (data.session) return;

  const res = await fetch("/api/messages");
  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error ?? "Failed to get supabase session");
  }

  await supabaseBrowser.auth.setSession({
    access_token: json.access_token,
    refresh_token: json.refresh_token,
  });
}

export default function MessageRoomPage({ params }: Props) {
  const conversationId = params.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ✅ 초기 세션 세팅 + 메시지 로드
  useEffect(() => {
    (async () => {
      try {
        await ensureSupabaseSession();

        const { data, error } = await supabaseBrowser
          .from("messages")
          .select("id, conversation_id, sender_email, text, created_at")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true })
          .limit(50);

        if (!error && data) setMessages(data as Message[]);
        if (error) console.error("messages load error:", error);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [conversationId]);

  // ✅ 실시간 구독
  useEffect(() => {
    let channel: any;

    (async () => {
      try {
        await ensureSupabaseSession();

        channel = supabaseBrowser
          .channel(`room:${conversationId}`)
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `conversation_id=eq.${conversationId}`,
            },
            (payload) => {
              const newMsg = payload.new as Message;
              setMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
            },
          )
          .subscribe();
      } catch (e) {
        console.error(e);
      }
    })();

    return () => {
      if (channel) supabaseBrowser.removeChannel(channel);
    };
  }, [conversationId]);

  //  스크롤 하단 유지
  // useEffect(() => {
  //   bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages.length]);

  // supabase insert → 서버 API로 전송
  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setText("");

    const res = await fetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId,
        text: trimmed,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("send error:", err);
      alert(err?.error ?? "메시지 전송 실패");
      return;
    }
  };

  return (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <h3>대화방: {conversationId}</h3>

      <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12, height: 420, overflow: "auto" }}>
        {messages.map((m) => (
          <div key={m.id} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              {m.sender_email} · {new Date(m.created_at).toLocaleString()}
            </div>
            <div style={{ padding: "6px 8px", border: "1px solid #eee", borderRadius: 8, display: "inline-block" }}>{m.text}</div>
          </div>
        ))}
        <div ref={bottomRef} style={{ backgroundColor: "red" }} />
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />
        <button onClick={send} style={{ padding: "10px 14px", borderRadius: 8 }}>
          전송
        </button>
      </div>
    </div>
  );
}
