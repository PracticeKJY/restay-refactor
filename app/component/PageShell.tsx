import type { ReactNode } from "react";
import styles from "./PageShell.module.css";

interface PageShellProps {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  count?: string;
}

export function PageHeader({ eyebrow, title, description, count }: Omit<PageShellProps, "children">) {
  return <header className={styles.header}>
      <div><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1><p className={styles.description}>{description}</p></div>
      {count && <span className={styles.count}>{count}</span>}
    </header>;
}

export default function PageShell({ children, ...header }: PageShellProps) {
  return <main className={styles.page}>
    <PageHeader {...header} />
    {children}
  </main>;
}
