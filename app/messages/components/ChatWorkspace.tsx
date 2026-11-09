"use client";

import { useLocale, useTranslations } from "next-intl";
import { FiMessageSquare, FiRefreshCw } from "react-icons/fi";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { Conversation, Message } from "@/types/chat";
import { useInbox } from "../hooks/useInbox";
import { updatePreview } from "../chat-model";
import ChatAvatar from "./ChatAvatar";
import styles from "../Messages.module.css";

interface Props {
  email?: string | null;
  selectedId?: string;
  activeConversation?: Conversation | null;
  latestMessage?: Message;
  children?: ReactNode;
}

export default function ChatWorkspace({ email, selectedId, activeConversation, latestMessage, children }: Props) {
  const t = useTranslations("Messages");
  const locale = useLocale();
  const inbox = useInbox(email);
  let conversations = inbox.conversations;
  if (activeConversation && !conversations.some(room => room.id === activeConversation.id)) conversations = [activeConversation, ...conversations];
  if (latestMessage) conversations = updatePreview(conversations, latestMessage);

  return <main className={styles.workspace}>
    <header className={styles.pageHeader}>
      <h1>{t("messages")}</h1><p>{t("pageDescription")}</p>
    </header>
    {!email ? <div className={styles.emptyState}><FiMessageSquare aria-hidden="true" size={36} /><h2>{t("loginRequired")}</h2><p>{t("loginDescription")}</p><Link href="/">{t("goHome")}</Link></div> :
      <div className={styles.workspaceBody}>
        <aside aria-label={t("conversationList")} className={`${styles.sidebar} ${selectedId ? styles.hideOnMobile : ""}`}>
          <div className={styles.sidebarHeader}><h2>{t("allMessages")}</h2><button type="button" className={styles.iconButton} aria-label={t("refresh")} onClick={inbox.reload}><FiRefreshCw /></button></div>
          {inbox.failed && <div className={styles.notice} role="status">{t("loadFailed")} <button type="button" onClick={inbox.reload}>{t("retry")}</button></div>}
          {inbox.loading && conversations.length === 0 ? <p className={styles.loading} role="status">{t("loading")}</p> : conversations.length === 0 ?
            <div className={styles.emptyInbox}><FiMessageSquare size={28} aria-hidden="true" /><p>{t("noConversationsYet")}</p><span>{t("emptyInboxDescription")}</span><Link href="/trips">{t("viewTrips")}</Link></div> :
            <ul className={styles.conversationList}>{conversations.map(room => {
              const peer = room.host_email === email ? t("guest") : t("host");
              const date = new Date(room.last_message_at ?? room.created_at);
              return <li key={room.id}><Link href={`/messages/${room.id}`} aria-current={selectedId === room.id ? "page" : undefined} className={`${styles.conversationLink} ${selectedId === room.id ? styles.selected : ""}`}>
                <ChatAvatar label={peer} />
                <span className={styles.conversationCopy}><span className={styles.conversationTitle}><strong>{peer}</strong><time dateTime={date.toISOString()}>{new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(date)}</time></span>
                  <span className={styles.preview}>{room.last_message_text || t("startConversation")}</span><span className={styles.reservationLabel}>{t("reservationConversation")}</span>
                </span>
              </Link></li>;
            })}</ul>}
        </aside>
        <section aria-label={t("conversationArea")} className={`${styles.conversationArea} ${!selectedId ? styles.hideOnMobile : ""}`}>
          {children ?? <div className={styles.emptyState}><FiMessageSquare size={44} aria-hidden="true" /><h2>{t("selectConversation")}</h2><p>{t("selectDescription")}</p></div>}
        </section>
      </div>}
  </main>;
}
