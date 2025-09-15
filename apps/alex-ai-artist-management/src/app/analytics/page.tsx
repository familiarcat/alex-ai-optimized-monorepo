"use client";

import { Analytics } from "@/components/analytics/analytics";
import { useStyles } from "@/hooks/useStyles";

export default function AnalyticsPage() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <Analytics />
    </div>
  );
}
