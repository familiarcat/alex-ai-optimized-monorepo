"use client";

import { IntegrationsPage } from "@/components/integrations/integrations-page";
import { useStyles } from "@/hooks/useStyles";

export default function Integrations() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <IntegrationsPage />
    </div>
  );
}
