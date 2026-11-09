"use client";

import { useEffect, useRef, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import ensureSupabaseSession from "@/lib/ensureSupabaseSession";
import type { Conversation, Message } from "@/types/chat";
import { conversationColumns, fetchMessages, postMessage } from "../chat-client";
import { confirmMessage, isMessage, mergeMessages, type ChatMessage } from "../chat-model";

export function useConversation(id: string, email?: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(Boolean(email));
  const [failed, setFailed] = useState(false);
  const [sending, setSending] = useState(false);
  const [connection, setConnection] = useState("connecting");
  const [version, setVersion] = useState(0);
  const alive = useRef(false);
  const sendingRef = useRef(false);
  const refreshRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (!email) return;
    alive.current = true;
    let cancelled = false;
    let fetching = false;
    let channelConnected = false;
    let channel: ReturnType<typeof supabaseBrowser.channel> | undefined;
    let timer: ReturnType<typeof setInterval> | undefined;
    const refresh = async () => {
      if (cancelled || fetching) return;
      fetching = true;
      try {
        const rows = await fetchMessages(id);
        if (!cancelled) {
          setMessages(current => mergeMessages(current, rows));
          if (channelConnected) setConnection("connected");
        }
      } catch {
        if (!cancelled) setConnection("reconnecting");
      } finally { fetching = false; }
    };
    refreshRef.current = refresh;
    const onVisible = () => { if (document.visibilityState === "visible") void refresh(); };
    setLoading(true);
    setFailed(false);
    setConnection("connecting");
    void (async () => {
      try {
        await ensureSupabaseSession(email);
        if (cancelled) return;
        const room = await supabaseBrowser.from("conversations").select(conversationColumns).eq("id", id).maybeSingle();
        if (room.error || !room.data || (room.data.host_email !== email && room.data.guest_email !== email)) throw new Error("Conversation unavailable");
        if (cancelled) return;
        setConversation(room.data as Conversation);
        fetching = true;
        channel = supabaseBrowser.channel(`room:${id}:${crypto.randomUUID()}`)
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${id}` }, payload => {
            const row = payload.new;
            if (!cancelled && isMessage(row) && row.conversation_id === id) setMessages(current => mergeMessages(current, [row]));
          })
          .subscribe(status => {
            if (cancelled) return;
            channelConnected = status === "SUBSCRIBED";
            setConnection(status === "SUBSCRIBED" ? "connected" : "reconnecting");
            if (status === "SUBSCRIBED") void refresh();
          });
        let initial: Message[];
        try { initial = await fetchMessages(id); }
        finally { fetching = false; }
        if (cancelled) return;
        setMessages(current => mergeMessages(current, initial));
        setLoading(false);
        timer = setInterval(onVisible, 8000);
        document.addEventListener("visibilitychange", onVisible);
        window.addEventListener("focus", onVisible);
      } catch {
        if (!cancelled) { setFailed(true); setLoading(false); }
      }
    })();
    return () => {
      cancelled = true;
      alive.current = false;
      refreshRef.current = null;
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      if (channel) void supabaseBrowser.removeChannel(channel);
    };
  }, [id, email, version]);

  const send = async (text: string, retryId?: string) => {
    const trimmed = text.trim();
    if (!trimmed || !email || loading || failed || sendingRef.current) return;
    sendingRef.current = true;
    setSending(true);
    const temporaryId = retryId ?? `pending:${crypto.randomUUID()}`;
    const optimistic: ChatMessage = { id: temporaryId, conversation_id: id, sender_email: email, text: trimmed, created_at: new Date().toISOString(), delivery: "sending" };
    setMessages(current => mergeMessages(current, [optimistic]));
    try {
      const serverId = await postMessage(id, trimmed);
      if (!alive.current) return;
      const confirmed = { ...optimistic, id: serverId, delivery: undefined };
      setMessages(current => confirmMessage(current, temporaryId, confirmed));
      void refreshRef.current?.();
    } catch {
      if (alive.current) setMessages(current => current.map(message => message.id === temporaryId ? { ...message, delivery: "failed" } : message));
    } finally {
      sendingRef.current = false;
      if (alive.current) setSending(false);
    }
  };

  return { messages, conversation, loading, failed, sending, connection, send, reload: () => setVersion(value => value + 1) };
}
