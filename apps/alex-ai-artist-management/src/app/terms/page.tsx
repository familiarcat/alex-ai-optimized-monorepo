"use client";

import { TermsPage } from "@/components/terms/terms-page";
import { useStyles } from "@/hooks/useStyles";

export default function Terms() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <TermsPage />
    </div>
  );
}
