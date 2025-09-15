"use client";

import { VisualArtistsPage } from "@/components/artists/visual-artists-page";
import { useStyles } from "@/hooks/useStyles";

export default function VisualArtistsPageRoute() {
  const styles = useStyles('page');

  return (
    <div className={styles.container}>
      <VisualArtistsPage />
    </div>
  );
}
