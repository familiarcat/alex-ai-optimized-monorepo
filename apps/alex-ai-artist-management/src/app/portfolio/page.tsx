"use client";

import { Portfolio } from "@/components/portfolio/portfolio";
import { useStyles } from "@/hooks/useStyles";

export default function PortfolioPage() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <Portfolio />
    </div>
  );
}
