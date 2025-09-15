"use client";

import { Opportunities } from "@/components/opportunities/opportunities";
import { useStyles } from "@/hooks/useStyles";

export default function OpportunitiesPage() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <Opportunities />
    </div>
  );
}
