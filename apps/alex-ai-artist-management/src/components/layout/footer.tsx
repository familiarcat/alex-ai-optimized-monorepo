"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { useStyles } from "@/hooks/useStyles";

export function Footer() {
  const styles = useStyles('footer');
  const footerLinks = {
    product: [
      { name: "Features", href: "/features" },
      { name: "Pricing", href: "/pricing" },
      { name: "API", href: "/api" },
      { name: "Integrations", href: "/integrations" },
    ],
    artists: [
      { name: "Musicians", href: "/artists/musicians" },
      { name: "Visual Artists", href: "/artists/visual" },
      { name: "Writers", href: "/artists/writers" },
      { name: "Performers", href: "/artists/performers" },
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Documentation", href: "/docs" },
      { name: "Community", href: "/community" },
      { name: "Contact", href: "/contact" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
    ],
  };

  const socialLinks = [
    { name: "Twitter", href: "https://twitter.com/alex_ai_dev", icon: Twitter },
    { name: "GitHub", href: "https://github.com/alex-ai", icon: Github },
    { name: "LinkedIn", href: "https://linkedin.com/company/alex-ai", icon: Linkedin },
    { name: "Email", href: "mailto:hello@alex-ai-artist-management.com", icon: Mail },
  ];

  return (
    <footer className={styles.container}>
      <div className={styles.content}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-bold text-xl text-gray-900">
                Alex AI Artist
              </span>
            </Link>
            <p className={styles.description}>
              Empowering artists to manage their careers with AI-powered tools
              and comprehensive booking management.
            </p>
            <div className={styles.socialLinks}>
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={styles.socialLink}
                  aria-label={item.name}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className={styles.section}>
            <h3 className={styles.title}>
              Product
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={styles.link}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Artists */}
          <div className={styles.section}>
            <h3 className={styles.title}>
              For Artists
            </h3>
            <ul className="space-y-3">
              {footerLinks.artists.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={styles.link}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className={styles.section}>
            <h3 className={styles.title}>
              Support
            </h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={styles.link}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className={styles.section}>
            <h3 className={styles.title}>
              Company
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={styles.link}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className={styles.bottom}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={styles.copyright}>
              © 2025 Alex AI Artist Management Platform. All rights reserved.
            </p>
            <div className={styles.legal}>
              <Link
                href="/privacy"
                className={styles.legalLink}
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className={styles.legalLink}
              >
                Terms of Service
              </Link>
              <Link
                href="/cookies"
                className={styles.legalLink}
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
