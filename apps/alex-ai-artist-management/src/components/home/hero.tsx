"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Star, Users, Calendar, TrendingUp } from "lucide-react";
import { useStyles } from "@/hooks/useStyles";

export function Hero() {
  const styles = useStyles('hero');
  const stats = [
    { icon: Users, label: "Active Artists", value: "10,000+" },
    { icon: Calendar, label: "Shows Booked", value: "50,000+" },
    { icon: Star, label: "Success Rate", value: "98%" },
    { icon: TrendingUp, label: "Earnings Growth", value: "150%" },
  ];

  return (
    <section className={styles.container}>
      {/* Background Pattern */}
      <div className={styles.background}>
        <div className="w-full h-full bg-gradient-to-br from-blue-100/20 to-purple-100/20"></div>
      </div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`${styles.floatingElement} ${styles.floatingPrimary}`}></div>
        <div className={`${styles.floatingElement} ${styles.floatingSecondary}`} style={{ animationDelay: '1s' }}></div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.grid}>
          {/* Content */}
          <div className={styles.textContainer}>
            <h1 className={styles.heading}>
              <span className={styles.subheading}>YOUR ART</span>
              <span className={styles.gradientText}>DESERVES BETTER</span>
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold">
                WE'RE HERE TO HELP
              </span>
            </h1>
            
            <p className={styles.description}>
              A platform built by artists, for artists. Where your creativity is the priority, 
              not the algorithm. Where community matters more than competition. Where every artist 
              has the tools they need to thrive.
            </p>

            <div className={styles.buttonContainer}>
              <button 
                className="cta-hero-primary"
                onClick={() => window.location.href = '/signup'}
              >
                Join Our Community
              </button>
              <button 
                className="cta-hero-secondary-enhanced"
                onClick={() => window.location.href = '/demo'}
              >
                <Play className="w-5 h-5 mr-2 inline" />
                See How It Works
              </button>
            </div>

            {/* Trust Indicators */}
            <div className={styles.trustContainer}>
              <p className="mb-2 text-sm text-gray-500">Join 10,000+ artists who are thriving</p>
              <div className="flex items-center justify-center lg:justify-start space-x-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={styles.avatar}
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-500">Join our community</span>
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className={styles.visualContainer}>
            <div className={styles.dashboardCard}>
              <div className="space-y-6">
                {/* Mock Dashboard */}
                <div className={styles.dashboardHeader}>
                  <h3 className={styles.dashboardTitle}>
                    Your Creative Hub
                  </h3>
                  <div className={styles.statusDots}>
                    <div className={`${styles.statusDot} bg-red-400`}></div>
                    <div className={`${styles.statusDot} bg-yellow-400`} style={{ animationDelay: '0.5s' }}></div>
                    <div className={`${styles.statusDot} bg-green-400`} style={{ animationDelay: '1s' }}></div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className={styles.statsGrid}>
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className={styles.statCard}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={styles.statIcon}>
                          <stat.icon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className={styles.statValue}>
                            {stat.value}
                          </p>
                          <p className={styles.statLabel}>
                            {stat.label}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className={styles.activityContainer}>
                  <h4 className={styles.activityTitle}>Recent Activity</h4>
                  <div className={styles.activityList}>
                    {[
                      "The Blue Note wants your sound",
                      "Art Gallery NYC discovered your work",
                      "Jazz Festival payment received",
                      "Poetry Reading Series needs your voice"
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className={styles.activityItem}
                      >
                        <div className={styles.activityDot} style={{ animationDelay: `${index * 0.2}s` }}></div>
                        <span className={styles.activityText}>{activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className={`${styles.floatingElement} ${styles.floatingPrimary}`}></div>
            <div className={`${styles.floatingElement} ${styles.floatingSecondary}`} style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
