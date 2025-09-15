"use client";

import { PrivacyPage } from "@/components/privacy/privacy-page";
import { useStyles } from "@/hooks/useStyles";

export default function Privacy() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <PrivacyPage />
    </div>
  );
}
