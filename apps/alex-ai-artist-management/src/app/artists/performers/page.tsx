"use client";

import { PerformersPage } from "@/components/artists/performers-page";
import { useStyles } from "@/hooks/useStyles";

export default function PerformersPageRoute() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <PerformersPage />
    </div>
  );
}
