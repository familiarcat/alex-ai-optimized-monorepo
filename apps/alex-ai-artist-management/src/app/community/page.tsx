"use client";

import { CommunityPage } from "@/components/community/community-page";
import { useStyles } from "@/hooks/useStyles";

export default function Community() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <CommunityPage />
    </div>
  );
}
