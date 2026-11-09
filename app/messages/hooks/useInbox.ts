"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase-browser";
import ensureSupabaseSession from "@/lib/ensureSupabaseSession";
import type { Conversation } from "@/types/chat";
import { fetchInbox } from "../chat-client";
import { isMessage, updatePreview } from "../chat-model";

export function useInbox(email?: string | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(Boolean(email));
  const [failed, setFailed] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!email) return;
    let cancelled = false;
    let fetching = false;
    let channel: ReturnType<typeof supabaseBrowser.channel> | undefined;
    let timer: ReturnType<typeof setInterval> | undefined;
    const refresh = async () => {
      if (cancelled || fetching) return;
      fetching = true;
      try {
        const rows = await fetchInbox(email);
        if (!cancelled) { setConversations(rows); setFailed(false); }
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        fetching = false;
        if (!cancelled) setLoading(false);
      }
    };
    const onVisible = () => { if (document.visibilityState === "visible") void refresh(); };
    setLoading(true);
    setFailed(false);
    void (async () => {
      try {
        await ensureSupabaseSession(email);
        if (cancelled) return;
        channel = supabaseBrowser.channel(`inbox:${crypto.randomUUID()}`)
          .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, payload => {
            const message = payload.new;
            if (!cancelled && isMessage(message)) setConversations(current => updatePreview(current, message));
          })
          .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => { void refresh(); })
          .subscribe(status => { if (status === "SUBSCRIBED") void refresh(); });
        await refresh();
        if (cancelled) return;
        // Recover missed events without changing Realtime publication or RLS policy.
        timer = setInterval(onVisible, 30000);
        document.addEventListener("visibilitychange", onVisible);
        window.addEventListener("focus", onVisible);
      } catch {
        if (!cancelled) { setFailed(true); setLoading(false); }
      }
    })();
    return () => {
      cancelled = true;
      if (timer) clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      if (channel) void supabaseBrowser.removeChannel(channel);
    };
  }, [email, version]);

  return { conversations, loading, failed, reload: () => setVersion(value => value + 1) };
}
