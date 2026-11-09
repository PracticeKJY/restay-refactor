"use client";

import { supabaseBrowser } from "@/lib/supabase-browser";
import ensureSupabaseSession from "@/lib/ensureSupabaseSession";
import type { Conversation, Message } from "@/types/chat";
import { isMessage, updatePreview } from "./chat-model";

export const conversationColumns = "id, created_at, reservation_id, listing_id, host_email, guest_email, last_message_at, last_message_text";

export async function fetchInbox(email: string): Promise<Conversation[]> {
  const { data, error } = await supabaseBrowser.from("conversations").select(conversationColumns)
    .order("last_message_at", { ascending: false, nullsFirst: false });
  if (error) throw error;
  let conversations = ((data ?? []) as Conversation[]).filter(row => row.host_email === email || row.guest_email === email);
  if (!conversations.length) return conversations;
  // A single bounded read supplies previews even when no DB preview trigger exists.
  const recent = await supabaseBrowser.from("messages").select("id, conversation_id, sender_email, text, created_at")
    .in("conversation_id", conversations.map(row => row.id)).order("created_at", { ascending: false }).limit(200);
  if (!recent.error) for (const message of (recent.data ?? []).filter(isMessage)) conversations = updatePreview(conversations, message);
  return conversations;
}

export async function fetchMessages(id: string): Promise<Message[]> {
  const { data, error } = await supabaseBrowser.from("messages").select("id, conversation_id, sender_email, text, created_at")
    .eq("conversation_id", id).order("created_at", { ascending: false }).limit(50);
  if (error) throw error;
  return (data ?? []).filter(isMessage);
}

export async function postMessage(conversationId: string, text: string): Promise<string> {
  const response = await fetch("/api/messages/send", {
    method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ conversationId, text }),
  });
  if (!response.ok) throw new Error("Message delivery was not confirmed");
  const data = await response.json();
  if (typeof data?.id !== "string") throw new Error("Missing message confirmation");
  return data.id;
}

export async function openReservationConversation(reservationId: string, email: string): Promise<string> {
  await ensureSupabaseSession(email);
  // Reopening an existing room must not repeat the server's upsert or clear previews.
  const existing = await supabaseBrowser.from("conversations").select("id").eq("reservation_id", reservationId).maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data?.id) return existing.data.id;

  const response = await fetch("/api/chat/get-or-create", {
    method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reservationId }),
  });
  if (!response.ok) throw new Error("Could not open the reservation conversation");
  const data = await response.json();
  if (typeof data?.conversationId !== "string") throw new Error("Missing conversation");
  return data.conversationId;
}
