"use client";

import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStyles } from "@/hooks/useStyles";

export function Pricing() {
  const styles = useStyles('pricing');
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for emerging artists getting started",
      features: [
        "Basic profile and portfolio",
        "Up to 5 booking requests per month",
        "Basic analytics dashboard",
        "Email support",
        "Mobile app access"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Ideal for active artists building their career",
      features: [
        "Advanced profile and portfolio",
        "Unlimited booking requests",
        "Advanced analytics and insights",
        "Priority support",
        "Calendar integration",
        "Payment processing",
        "AI-powered recommendations",
        "Custom branding"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For established artists and collectives",
      features: [
        "Everything in Professional",
        "Team collaboration tools",
        "Advanced financial tracking",
        "Custom integrations",
        "Dedicated account manager",
        "White-label options",
        "API access",
        "Custom reporting"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.heading}>
            Simple, Transparent
            <span className={styles.gradientHeading}>Pricing</span>
          </h2>
          <p className={styles.description}>
            Choose the plan that fits your artistic career stage. 
            Upgrade or downgrade anytime as your needs change.
          </p>
        </div>

        <div className={styles.grid}>
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`${styles.planCard} ${
                plan.popular ? styles.planCardPopular : styles.planCardDefault
              }`}
            >
              {plan.popular && (
                <div className={styles.popularBadge}>
                  <Star className="w-4 h-4" />
                  <span>Most Popular</span>
                </div>
              )}

              <div className={styles.planHeader}>
                <h3 className={styles.planName}>
                  {plan.name}
                </h3>
                <div className={styles.planPrice}>
                  <span className={styles.planPriceValue}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={styles.planPricePeriod}>{plan.period}</span>
                  )}
                </div>
                <p className={styles.planDescription}>{plan.description}</p>
              </div>

              <ul className={styles.planFeatures}>
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={styles.planFeature}>
                    <Check className={styles.planFeatureIcon} />
                    <span className={styles.planFeatureText}>{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`${styles.planButton} ${
                  plan.popular ? styles.planButtonPopular : styles.planButtonDefault
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerCard}>
            <h3 className={styles.footerTitle}>
              Need a custom solution?
            </h3>
            <p className={styles.footerDescription}>
              We offer custom plans for large collectives, educational institutions, 
              and organizations managing multiple artists.
            </p>
            <Button variant="outline" size="lg" className={styles.footerButton}>
              Contact Our Sales Team
            </Button>
          </div>
        </div>

        <div className={styles.disclaimer}>
          <p className={styles.disclaimerText}>
            All plans include a 14-day free trial. No credit card required to start.
            Cancel anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
