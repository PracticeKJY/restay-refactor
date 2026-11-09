"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { FiArrowLeft, FiSend } from "react-icons/fi";
import { Link } from "@/i18n/navigation";
import { useConversation } from "../hooks/useConversation";
import ChatWorkspace from "./ChatWorkspace";
import ChatAvatar from "./ChatAvatar";
import styles from "../Messages.module.css";

interface ListingContext { title: string; userName?: string; userImage?: string; }
interface Props { params: { id: string }; currentUserEmail?: string | null; }

export default function ConversationView({ params, currentUserEmail }: Props) {
  const t = useTranslations("Messages");
  const locale = useLocale();
  const room = useConversation(params.id, currentUserEmail);
  const [text, setText] = useState("");
  const [listing, setListing] = useState<ListingContext | null>(null);
  const thread = useRef<HTMLDivElement>(null);
  const latest = room.messages[room.messages.length - 1];
  const confirmed = room.messages.filter(message => !message.delivery);
  const peerIsHost = room.conversation?.host_email !== currentUserEmail;
  const peer = peerIsHost ? listing?.userName || t("host") : t("guest");

  useEffect(() => {
    const id = room.conversation?.listing_id;
    if (!id) return;
    const controller = new AbortController();
    void fetch(`/api/listings/${encodeURIComponent(id)}`, { signal: controller.signal }).then(async response => {
      if (!response.ok) return;
      const value = await response.json();
      if (typeof value?.title === "string" && !controller.signal.aborted) setListing({
        title: value.title, userName: typeof value.userName === "string" ? value.userName : undefined,
        userImage: typeof value.userImage === "string" ? value.userImage : undefined,
      });
    }).catch(() => { /* Listing context is optional; chat remains available. */ });
    return () => controller.abort();
  }, [room.conversation?.listing_id]);

  useEffect(() => {
    // Scroll only the message pane, including messages received while reading history.
    if (thread.current) thread.current.scrollTop = thread.current.scrollHeight;
  }, [room.messages.length, latest?.id, room.loading]);

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed || room.sending || room.loading || room.failed) return;
    setText("");
    void room.send(trimmed);
  };

  return <ChatWorkspace email={currentUserEmail} selectedId={params.id} activeConversation={room.conversation} latestMessage={confirmed[confirmed.length - 1]}>
    <header className={styles.chatHeader}>
      <Link href="/messages" className={styles.backLink} aria-label={t("backToInbox")}><FiArrowLeft /></Link>
      <ChatAvatar label={peer} src={peerIsHost ? listing?.userImage : undefined} />
      <div className={styles.chatHeading}><h2>{peer}</h2><p>{t("reservationConversation")}</p></div>
    </header>
    {listing && room.conversation?.listing_id && <Link className={styles.listingContext} href={`/listings/${room.conversation.listing_id}`}><span>{listing.title}</span><span>{t("viewListing")} →</span></Link>}
    {room.connection === "reconnecting" && !room.failed && <p className={styles.connectionNotice} role="status">{t("reconnecting")}</p>}
    {room.failed ? <div className={styles.emptyState} role="status"><h2>{t("roomUnavailable")}</h2><p>{t("roomUnavailableDescription")}</p><button type="button" className={styles.retryButton} onClick={room.reload}>{t("retry")}</button></div> :
      <div ref={thread} className={styles.thread} role="log" aria-label={t("messageHistory")} aria-live="polite" aria-busy={room.loading}>
        {room.loading ? <p className={styles.loading}>{t("loading")}</p> : room.messages.length === 0 ? <div className={styles.emptyThread}><p>{t("sayHello")}</p><span>{t("conversationHint")}</span></div> : room.messages.map((message, index) => {
          const own = message.sender_email === currentUserEmail;
          const date = new Date(message.created_at);
          const previousDate = index ? new Date(room.messages[index - 1].created_at) : null;
          const showDate = !previousDate || date.toDateString() !== previousDate.toDateString();
          return <div key={message.id}>
            {showDate && <div className={styles.dayDivider}><time dateTime={message.created_at}>{new Intl.DateTimeFormat(locale, { month: "long", day: "numeric", weekday: "short" }).format(date)}</time></div>}
            <div className={`${styles.messageRow} ${own ? styles.ownMessage : ""}`}>
              {!own && <ChatAvatar label={peer} src={peerIsHost ? listing?.userImage : undefined} />}
              <div className={styles.messageContent}>
                <div className={styles.messageMeta}><span>{own ? t("you") : peer}</span><time dateTime={message.created_at}>{new Intl.DateTimeFormat(locale, { hour: "numeric", minute: "2-digit" }).format(date)}</time></div>
                <div className={`${styles.bubble} ${message.delivery === "failed" ? styles.failedBubble : ""}`}>{message.text}</div>
                {message.delivery === "sending" && <span className={styles.deliveryStatus}>{t("sending")}</span>}
                {message.delivery === "failed" && <div className={styles.deliveryStatus} role="status">{t("deliveryUnconfirmed")} <button type="button" disabled={room.sending} onClick={() => { void room.send(message.text, message.id); }}>{t("retry")}</button></div>}
              </div>
            </div>
          </div>;
        })}
      </div>}
    <form className={styles.composer} onSubmit={event => { event.preventDefault(); submit(); }}>
      <div className={styles.composerField}>
        <textarea value={text} rows={2} disabled={!currentUserEmail || room.loading || room.failed} aria-label={t("writeAMessage")} placeholder={t("writeAMessage")}
          onChange={event => setText(event.target.value)}
          onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing && event.nativeEvent.keyCode !== 229) { event.preventDefault(); submit(); } }} />
        <button type="submit" className={styles.sendButton} aria-label={t("send")} disabled={!text.trim() || room.sending || room.loading || room.failed}><FiSend aria-hidden="true" /></button>
      </div><p>{t("composerHint")}</p>
    </form>
  </ChatWorkspace>;
}
