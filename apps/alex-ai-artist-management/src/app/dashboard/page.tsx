"use client";

import { Dashboard } from "@/components/dashboard/dashboard";
import { useStyles } from "@/hooks/useStyles";

export default function DashboardPage() {
  const styles = useStyles('page');
  
  return (
    <div className={styles.container}>
      <Dashboard />
    </div>
  );
}
