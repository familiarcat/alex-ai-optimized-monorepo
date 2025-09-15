"use client";

import { CookiesPage } from "@/components/cookies/cookies-page";
import { useStyles } from "@/hooks/useStyles";

export default function Cookies() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <CookiesPage />
    </div>
  );
}
