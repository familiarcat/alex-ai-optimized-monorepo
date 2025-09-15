"use client";

import { BlogPage } from "@/components/blog/blog-page";
import { useStyles } from "@/hooks/useStyles";

export default function Blog() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <BlogPage />
    </div>
  );
}
