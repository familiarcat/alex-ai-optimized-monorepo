"use client";

import { MusiciansPage } from "@/components/artists/musicians-page";
import { useStyles } from "@/hooks/useStyles";

export default function MusiciansPageRoute() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <MusiciansPage />
    </div>
  );
}
