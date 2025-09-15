"use client";

import { Star, Quote } from "lucide-react";
import { useStyles } from "@/hooks/useStyles";

export function Testimonials() {
  const styles = useStyles('testimonials');
  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Jazz Pianist",
      location: "New York, NY",
      content: "Alex AI Artist Management has revolutionized how I book gigs. The AI recommendations have helped me discover venues I never knew existed, and my booking success rate has increased by 300%.",
      rating: 5,
      avatar: "SC"
    },
    {
      name: "Marcus Rodriguez",
      role: "Visual Artist",
      location: "Los Angeles, CA",
      content: "The portfolio management features are incredible. I can showcase my work professionally and book gallery shows with ease. The financial tracking has made my business so much more organized.",
      rating: 5,
      avatar: "MR"
    },
    {
      name: "Emily Watson",
      role: "Poet & Author",
      location: "Portland, OR",
      content: "As a writer, I never thought I'd find a platform that understood my needs. The reading booking system and literary event management have opened doors I didn't know were there.",
      rating: 5,
      avatar: "EW"
    },
    {
      name: "David Kim",
      role: "DJ & Producer",
      location: "Miami, FL",
      content: "The club booking system is game-changing. I can track my performance data, manage my music library, and connect with promoters seamlessly. My bookings have doubled since joining.",
      rating: 5,
      avatar: "DK"
    },
    {
      name: "Lisa Thompson",
      role: "Photographer",
      location: "Chicago, IL",
      content: "The client management and shoot booking features have streamlined my entire business. I can focus on what I love - taking photos - while the platform handles the business side.",
      rating: 5,
      avatar: "LT"
    },
    {
      name: "James Wilson",
      role: "Theater Performer",
      location: "Seattle, WA",
      content: "The audition management and performance tracking tools are exactly what I needed. I can manage my entire performing career from one platform, and the AI insights help me make better career decisions.",
      rating: 5,
      avatar: "JW"
    }
  ];

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.heading}>
            Loved by Artists
            <span className={styles.gradientHeading}>Worldwide</span>
          </h2>
          <p className={styles.description}>
            See how Alex AI Artist Management is transforming careers across all artistic disciplines.
          </p>
        </div>

        <div className={styles.grid}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={styles.testimonialCard}
            >
              <div className={styles.rating}>
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className={styles.star} />
                ))}
              </div>
              
              <Quote className={styles.quote} />
              
              <p className={styles.content}>
                "{testimonial.content}"
              </p>
              
              <div className={styles.author}>
                <div className={styles.avatar}>
                  {testimonial.avatar}
                </div>
                <div className={styles.authorInfo}>
                  <h4 className={styles.authorName}>
                    {testimonial.name}
                  </h4>
                  <p className={styles.authorRole}>
                    {testimonial.role}
                  </p>
                  <p className={styles.authorLocation}>
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerCard}>
            <h3 className={styles.footerTitle}>
              Join thousands of successful artists
            </h3>
            <p className={styles.footerDescription}>
              Start your journey with Alex AI Artist Management today and see why artists worldwide trust us with their careers.
            </p>
            <div className={styles.footerButtons}>
              <button className="cta-card-primary">
                Start Free Trial
              </button>
              <button className="cta-card-secondary">
                View Success Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
