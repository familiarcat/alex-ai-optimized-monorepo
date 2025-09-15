"use client";

import { DocsPage } from "@/components/docs/docs-page";
import { useStyles } from "@/hooks/useStyles";

export default function Docs() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <DocsPage />
    </div>
  );
}
