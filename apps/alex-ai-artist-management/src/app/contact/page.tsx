"use client";

import { ContactPage } from "@/components/contact/contact-page";
import { useStyles } from "@/hooks/useStyles";

export default function ContactPageRoute() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <ContactPage />
    </div>
  );
}
