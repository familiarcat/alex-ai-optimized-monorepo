"use client";

import { PricingPage } from "@/components/pricing/pricing-page";
import { useStyles } from "@/hooks/useStyles";

export default function Pricing() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <PricingPage />
    </div>
  );
}
