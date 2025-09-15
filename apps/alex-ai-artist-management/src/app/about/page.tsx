"use client";

import { AboutPage } from "@/components/about/about-page";
import { useStyles } from "@/hooks/useStyles";

export default function AboutPageRoute() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <AboutPage />
    </div>
  );
}
