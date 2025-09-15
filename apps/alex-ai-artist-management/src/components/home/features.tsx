"use client";

import { 
  Calendar, 
  Users, 
  TrendingUp, 
  Shield, 
  Smartphone, 
  Zap,
  BarChart3,
  Globe,
  MessageSquare,
  CreditCard
} from "lucide-react";
import { useStyles } from "@/hooks/useStyles";

export function Features() {
  const styles = useStyles('features');
  const features = [
    {
      icon: Calendar,
      title: "Smart Booking System",
      description: "AI-powered matching that finds opportunities that align with your art and values. No more endless applications to venues that don't get it."
    },
    {
      icon: Users,
      title: "Portfolio That Shines",
      description: "Showcase your work in a way that's authentic to your artistic vision. Clean, professional, and uniquely yours."
    },
    {
      icon: TrendingUp,
      title: "Meaningful Analytics",
      description: "Track what actually matters: real bookings, genuine engagement, and the impact your art has on people's lives."
    },
    {
      icon: Shield,
      title: "Reliable Payments",
      description: "Secure, on-time payments with transparent tracking. Focus on your art, not chasing down payments."
    },
    {
      icon: Smartphone,
      title: "Art on the Go",
      description: "Manage your entire artistic career from anywhere. Because inspiration strikes when it wants to, not when you're at your desk."
    },
    {
      icon: Zap,
      title: "AI That Understands Art",
      description: "Machine learning designed by artists, for artists. Recommendations that actually make sense for your creative journey."
    },
    {
      icon: BarChart3,
      title: "Financial Clarity",
      description: "Simple, clear financial tracking that helps you understand your income and plan for your future as an artist."
    },
    {
      icon: Globe,
      title: "Global Community",
      description: "Connect with venues, artists, and opportunities worldwide. Your art deserves to be seen everywhere."
    },
    {
      icon: MessageSquare,
      title: "Direct Communication",
      description: "Connect directly with venues, fans, and collaborators. Build real relationships, not just transactions."
    },
    {
      icon: CreditCard,
      title: "Fair Pricing",
      description: "Plans that grow with your career. Free for emerging artists, fair rates for established ones. We're in this together."
    }
  ];

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.heading}>
            Everything You Need to
            <span className={styles.gradientHeading}>Thrive as an Artist</span>
          </h2>
          <p className={styles.description}>
            Built by artists who understand the struggle. Tools that actually work, 
            community that actually supports, and opportunities that actually pay.
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={styles.featureCard}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className={styles.featureIcon}>
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className={styles.featureTitle}>
                  {feature.title}
                </h3>
              </div>
              <p className={styles.featureDescription}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerBadge}>
            <Zap className="w-5 h-5" />
            <span className={styles.footerText}>
              Powered by Alex AI - Built for artists, by artists
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
