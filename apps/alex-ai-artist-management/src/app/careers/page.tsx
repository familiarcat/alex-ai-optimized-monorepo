"use client";

import { CareersPage } from "@/components/careers/careers-page";
import { useStyles } from "@/hooks/useStyles";

export default function Careers() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <CareersPage />
    </div>
  );
}
