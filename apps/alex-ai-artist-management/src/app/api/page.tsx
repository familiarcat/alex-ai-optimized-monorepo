"use client";

import { ApiPage } from "@/components/api/api-page";
import { useStyles } from "@/hooks/useStyles";

export default function Api() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <ApiPage />
    </div>
  );
}
