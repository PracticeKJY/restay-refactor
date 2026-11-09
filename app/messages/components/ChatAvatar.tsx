"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "../Messages.module.css";

export default function ChatAvatar({ label, src }: { label: string; src?: string }) {
  const [failed, setFailed] = useState(false);
  return <span className={styles.avatar} aria-hidden="true">
    {src && !failed ? <Image src={src} alt="" fill sizes="44px" onError={() => setFailed(true)} /> : label.slice(0, 1)}
  </span>;
}
