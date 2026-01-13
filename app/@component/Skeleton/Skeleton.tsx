"use client";

import React from "react";
import styles from "./Skeleton.module.css";

type SkeletonVariant = "card" | "image" | "text" | "avatar" | "custom";

type SkeletonProps = {
  variant?: SkeletonVariant;
  lines?: number;
  widths?: Array<string | number>;
  height?: number | string;
  width?: number | string;
  radius?: number;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
  imageHeight?: number;
  padding?: number;
  gap?: number;
};

const toCssSize = (v?: number | string) => {
  if (v === undefined) return undefined;
  return typeof v === "number" ? `${v}px` : v;
};

const cx = (...classes: Array<string | undefined | false>) => classes.filter(Boolean).join(" ");

const Skeleton = ({
  variant = "card",
  lines = 3,
  widths,
  height,
  width,
  radius = 8,
  animate = true,
  className,
  style,
  imageHeight = 180,
  padding = 20,
  gap = 10,
}: SkeletonProps) => {
  const defaultLineWidths = widths && widths.length > 0 ? widths : Array.from({ length: lines }, (_, i) => (i === lines - 1 ? "60%" : "100%"));

  const Block = ({ w, h, r = radius, extraClass }: { w?: string | number; h?: string | number; r?: number; extraClass?: string }) => (
    <div
      className={cx(styles.sk, animate && styles.animate, extraClass)}
      style={{
        width: toCssSize(w) ?? "100%",
        height: toCssSize(h) ?? "20px",
        borderRadius: `${r}px`,
      }}
    />
  );

  if (variant === "custom") {
    return (
      <div className={cx(styles.wrap, className)} style={style}>
        <Block w={width} h={height} />
      </div>
    );
  }

  if (variant === "image") {
    return (
      <div className={cx(styles.wrap, className)} style={style}>
        <Block w={width ?? "100%"} h={height ?? imageHeight} />
      </div>
    );
  }

  if (variant === "avatar") {
    const size = height ?? width ?? 48;
    return (
      <div className={cx(styles.wrap, className)} style={style}>
        <Block w={size} h={size} r={999} />
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className={cx(styles.wrap, styles.col, className)} style={{ gap: `${gap}px`, ...style }}>
        {defaultLineWidths.map((w, idx) => (
          <Block key={idx} w={w} h={height ?? 20} r={4} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cx(styles.wrap, styles.col, className)}
      style={{
        maxWidth: "300px",
        padding: `${padding}px`,
        gap: `${gap}px`,
        ...style,
      }}>
      <Block h={imageHeight} r={radius} />
      {defaultLineWidths.map((w, idx) => (
        <Block key={idx} w={w} h={20} r={4} />
      ))}
    </div>
  );
};

export default Skeleton;
