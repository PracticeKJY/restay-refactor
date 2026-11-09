import type { Conversation, Message } from "@/types/chat";

export type ChatMessage = Message & { delivery?: "sending" | "failed" };

export function isMessage(value: unknown): value is Message {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return ["id", "conversation_id", "sender_email", "text", "created_at"].every(key => typeof row[key] === "string");
}

export function mergeMessages(current: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  const byId = new Map(current.map(message => [message.id, message]));
  for (const message of incoming) byId.set(message.id, message);
  return Array.from(byId.values()).sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at) || a.id.localeCompare(b.id));
}

export function confirmMessage(current: ChatMessage[], temporaryId: string, confirmed: Message): ChatMessage[] {
  // Realtime can arrive before the HTTP response. Prefer its server timestamp.
  const existing = current.find(message => message.id === confirmed.id);
  return mergeMessages(current.filter(message => message.id !== temporaryId), [existing ?? confirmed]);
}

export function updatePreview(conversations: Conversation[], message: Message): Conversation[] {
  return conversations.map(conversation => conversation.id !== message.conversation_id ||
    Date.parse(conversation.last_message_at ?? "1970-01-01") > Date.parse(message.created_at)
    ? conversation
    : { ...conversation, last_message_at: message.created_at, last_message_text: message.text })
    .sort((a, b) => Date.parse(b.last_message_at ?? b.created_at) - Date.parse(a.last_message_at ?? a.created_at));
}
