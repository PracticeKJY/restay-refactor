// types/chat.ts
export interface Conversation {
  id: string;
  created_at: string;
  reservation_id: string | null;
  listing_id: string | null;
  host_email: string;
  guest_email: string;
  last_message_at: string | null;
  last_message_text: string | null;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_email: string;
  text: string;
  created_at: string;
}
