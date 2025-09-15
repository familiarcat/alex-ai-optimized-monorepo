"use client";

import { HelpPage } from "@/components/help/help-page";
import { useStyles } from "@/hooks/useStyles";

export default function Help() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <HelpPage />
    </div>
  );
}
