"use client";

import { supabaseBrowser } from "@/lib/supabase-browser";

const ensureSupabaseSession = async () => {
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
};

export default ensureSupabaseSession;
