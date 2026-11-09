"use client";

import { supabaseBrowser } from "@/lib/supabase-browser";
import type { Session } from "@supabase/supabase-js";

let pendingSession: Promise<Session> | null = null;

const ensureSupabaseSession = async (expectedEmail?: string): Promise<Session> => {
  const { data } = await supabaseBrowser.auth.getSession();
  if (data.session && (!expectedEmail || data.session.user.email === expectedEmail)) return data.session;

  if (!pendingSession) {
    pendingSession = (async () => {
      const res = await fetch("/api/session/supabase", { cache: "no-store", credentials: "same-origin" });
      if (!res.ok) throw new Error("Could not initialize the chat session");
      const json = await res.json();
      if (typeof json?.access_token !== "string" || typeof json?.refresh_token !== "string") {
        throw new Error("Invalid chat session response");
      }
      const result = await supabaseBrowser.auth.setSession({ access_token: json.access_token, refresh_token: json.refresh_token });
      if (result.error || !result.data.session) throw new Error("Could not set the chat session");
      return result.data.session;
    })().finally(() => { pendingSession = null; });
  }

  const session = await pendingSession;
  if (expectedEmail && session.user.email !== expectedEmail) throw new Error("Chat session does not match the signed-in user");
  return session;
};

export default ensureSupabaseSession;
