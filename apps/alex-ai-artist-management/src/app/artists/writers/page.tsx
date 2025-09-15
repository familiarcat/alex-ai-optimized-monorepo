"use client";

import { WritersPage } from "@/components/artists/writers-page";
import { useStyles } from "@/hooks/useStyles";

export default function WritersPageRoute() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <WritersPage />
    </div>
  );
}
