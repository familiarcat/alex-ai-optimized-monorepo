"use client";

import { FeaturesPage } from "@/components/features/features-page";
import { useStyles } from "@/hooks/useStyles";

export default function FeaturesPageRoute() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <FeaturesPage />
    </div>
  );
}
