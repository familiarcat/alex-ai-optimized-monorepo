"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, TrendingUp } from "lucide-react";
import { useStyles } from "@/hooks/useStyles";

export function CTA() {
  const styles = useStyles('cta');
  const stats = [
    { icon: Users, value: "10,000+", label: "Active Artists" },
    { icon: Calendar, value: "50,000+", label: "Bookings Made" },
    { icon: TrendingUp, value: "150%", label: "Avg. Revenue Growth" }
  ];

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.heading}>
            Ready to Transform Your
            <span className={styles.subheading}>Artistic Career?</span>
          </h2>
          
          <p className={styles.description}>
            Join thousands of artists who are already using Alex AI to manage their careers, 
            book gigs, and grow their artistic presence. Start your journey today.
          </p>

          <div className={styles.buttonContainer}>
            <Button 
              size="lg" 
              className={styles.primaryButton}
            >
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className={styles.secondaryButton}
            >
              Schedule a Demo
            </Button>
          </div>

          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <div key={index} className={styles.statItem}>
                <div className={styles.statIcon}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className={styles.statValue}>
                  {stat.value}
                </div>
                <div className={styles.statLabel}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.footer}>
            <p className={styles.footerText}>
              Join artists from 50+ countries • No credit card required • Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
