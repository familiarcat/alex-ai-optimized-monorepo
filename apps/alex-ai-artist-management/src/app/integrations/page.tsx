import { IntegrationsPage } from "@/components/integrations/integrations-page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integrations - Alex AI Artist Management",
  description: "Connect Alex AI with your favorite tools and platforms. Seamless integrations for a complete artist workflow.",
};

export default function Integrations() {
  return <IntegrationsPage />;
}
