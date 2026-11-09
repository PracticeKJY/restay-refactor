"use client";

import ChatWorkspace from "./ChatWorkspace";

export default function InboxView({ currentUserEmail }: { currentUserEmail?: string | null }) {
  return <ChatWorkspace email={currentUserEmail} />;
}
