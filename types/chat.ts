// types/chat.ts
export interface Conversation {
  id: string;
  created_at: string;
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
