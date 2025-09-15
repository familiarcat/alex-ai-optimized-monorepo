"use client";

import { PressPage } from "@/components/press/press-page";
import { useStyles } from "@/hooks/useStyles";

export default function Press() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <PressPage />
    </div>
  );
}
