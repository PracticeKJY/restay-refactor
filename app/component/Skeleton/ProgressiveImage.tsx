"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import styles from "./ProgressiveImage.module.css";

/** Keep the image's reserved space visible until it has decoded, including cached images. */
export default function ProgressiveImage({ onLoad, onError, style, alt, ...props }: ImageProps) {
  const key = typeof props.src === "string" ? props.src : "default" in props.src ? props.src.default.src : props.src.src;
  const [loaded, setLoaded] = useState<string>();
  const [failed, setFailed] = useState<string>();
  const ready = loaded === key;
  const content = (
    <>
      {!ready && <span aria-hidden="true" data-image-placeholder className={`${styles.placeholder} ${failed === key ? styles.failed : ""}`}></span>}
      <Image
        {...props}
        alt={alt}
        style={{ ...style, opacity: ready ? (style?.opacity ?? 1) : 0 }}
        onLoad={(event) => {
          setLoaded(key);
          onLoad?.(event);
        }}
        onError={(event) => {
          setFailed(key);
          onError?.(event);
        }}
      />
    </>
  );
  return props.fill ? (
    content
  ) : (
    <span className={styles.frame} style={{ width: props.width, height: props.height }}>
      {content}
    </span>
  );
}
