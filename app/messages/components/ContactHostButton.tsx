"use client";

import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { FiMessageSquare } from "react-icons/fi";
import { useRouter } from "@/i18n/navigation";
import { openReservationConversation } from "../chat-client";
import styles from "../Messages.module.css";

export default function ContactHostButton({ reservationId, email }: { reservationId: string; email: string }) {
  const t = useTranslations("Messages");
  const router = useRouter();
  const busy = useRef(false);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  return <div>
    <button type="button" className={styles.contactButton} disabled={loading} aria-busy={loading} onClick={async () => {
      if (busy.current) return;
      busy.current = true;
      setLoading(true); setFailed(false);
      try {
        const id = await openReservationConversation(reservationId, email);
        router.push(`/messages/${id}`);
      } catch { setFailed(true); }
      finally { busy.current = false; setLoading(false); }
    }}><FiMessageSquare aria-hidden="true" />{loading ? t("openingConversation") : t("contactHost")}</button>
    {failed && <p className={styles.contactError} role="status">{t("openConversationFailed")}</p>}
  </div>;
}
