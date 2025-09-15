"use client";

import { Bookings } from "@/components/bookings/bookings";
import { useStyles } from "@/hooks/useStyles";

export default function BookingsPage() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <Bookings />
    </div>
  );
}
