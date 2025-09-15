import { Dashboard } from "@/components/dashboard/dashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard - Alex AI Artist Management",
  description: "Your central command center for managing your artistic career",
};

export default function DashboardPage() {
  return <Dashboard />;
}
