import { Link } from "@tanstack/react-router";
import React from "react";
import { MessageCircle, Phone, Mail, MapPin, Globe, ArrowRight, Info } from "lucide-react";
import { brand, locations, navLinks, treatments, socials, legalLinks } from "@/data/content";
import { Logo } from "@/components/ui/Logo";
import { Reveal } from "@/components/shared/Reveal";
import { CurveDivider } from "@/components/shared/CurveDivider";

// SVG paths for brands from simple-icons (minimized)
const BRAND_ICONS: Record<string, { path: string; color: string }> = {
  Instagram: {
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.981 1.28.058 1.688.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.981-6.98.058-1.28.072-1.688.072-4.949 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
    color: "#E4405F",
  },
  Facebook: {
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
    color: "#1877F2",
  },
  Youtube: {
    path: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.872.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
    color: "#FF0000",
  },
};

const BrandIcon = ({ name, className }: { name: string; className?: string }) => {
  const brand = BRAND_ICONS[name];
  if (!brand) return null;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d={brand.path} />
    </svg>
  );
};

const iconMap: Record<string, React.ElementType> = {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Globe,
  ArrowRight,
  Info,
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer role="contentinfo" className="relative overflow-hidden isolate" id="contact">
      <CurveDivider fill="custom" className="text-[var(--dark-surface)]" />

      <div className="bg-[var(--dark-surface)] dark:border-t dark:border-white/10 pt-[clamp(72px,9vw,112px)] pb-0">
        {/* Decorative Layers */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {/* Primary Glow */}
          <div className="absolute -bottom-1/4 -left-1/4 w-[700px] h-[700px] rounded-full bg-primary/14 dark:bg-primary/10 blur-[160px]" />
          {/* Accent Glow */}
          <div className="absolute -top-1/4 -right-1/4 w-[460px] h-[460px] rounded-full bg-accent/7 blur-[140px]" />
          {/* Grain */}
          {/* Dot Grid */}
          <div className="absolute top-0 inset-x-0 h-[30%] opacity-3 [mask-image:linear-gradient(to_bottom,black,transparent)]">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="footer-dots" width="26" height="26" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#footer-dots)" />
            </svg>
          </div>
        </div>

        <div className="container-x relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[2.2fr_1fr_1.2fr_1.4fr] gap-x-10 gap-y-12 lg:gap-x-14 xl:gap-x-14">
            {/* Column 1: Brand */}
            <Reveal delay={0}>
              <div className="col-span-1 md:col-span-2 xl:col-span-1">
                <Link
                  to="/"
                  aria-label="GoRebalance - home"
                  className="inline-flex items-center min-h-[44px] gap-3 group transition-opacity hover:opacity-85"
                >
                  <Logo tone="light" size={40} />
                </Link>
                <p className="mt-2.5 text-[12.5px] font-semibold uppercase tracking-[0.14em] text-on-dark-accent">
                  Gut Health · Nutrition · Balance
                </p>
                <p className="mt-5 text-[14.5px] leading-[1.7] text-on-dark-muted max-w-[42ch]">
                  Root-cause nutrition and gut health care by Dt. N. Sai Sowjanya. We treat
                  bloating, acidity, hormonal imbalance and low energy where they actually begin —
                  so the results hold without the plan.
                </p>

                <div className="mt-7 flex flex-row gap-2.5">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GoRebalance on ${social.label}`}
                      className="w-11 h-11 rounded-full bg-on-dark-glass border border-on-dark-border grid place-items-center text-[var(--on-dark)] transition-all duration-300 hover:bg-accent-strong hover:border-accent hover:text-white hover:-translate-y-0.75 hover:shadow-[0_8px_20px_rgba(var(--accent-rgb), 0.28)]"
                    >
                      {social.icon === "MessageCircle" ? (
                        <MessageCircle className="w-[18px] h-[18px]" aria-hidden="true" />
                      ) : (
                        <BrandIcon name={social.icon} className="w-[18px] h-[18px]" />
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Column 2: Explore */}
            <Reveal delay={0.08}>
              <nav aria-label="Explore">
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-on-dark-faint mb-5">
                  EXPLORE
                </h3>
                <div className="w-6 h-0.5 bg-accent mb-3" />
                <ul className="list-none p-0 m-0">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="group relative flex items-center min-h-[44px] w-fit py-[7px] text-[14.5px] leading-[1.5] text-on-dark-muted transition-all duration-250 hover:text-accent-contrast hover:translate-x-1.25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-[3px]"
                      >
                        <span className="absolute left-[-14px] top-1/2 -translate-y-1/2 w-2 h-[1.5px] bg-accent origin-left scale-x-0 transition-transform duration-250 group-hover:scale-x-100" />
                        {link.label}
                      </a>
                    </li>
                  ))}
                  {/* Not in navLinks: this belongs to people who have already
                      applied, so it stays out of the main navigation but has
                      to be findable by someone coming back later. */}
                  <li>
                    <Link
                      to="/track"
                      className="group relative flex items-center min-h-[44px] w-fit py-[7px] text-[14.5px] leading-[1.5] text-on-dark-muted transition-all duration-250 hover:text-on-dark-accent hover:translate-x-1.25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-[3px]"
                    >
                      <span className="absolute left-[-14px] top-1/2 -translate-y-1/2 w-2 h-[1.5px] bg-accent origin-left scale-x-0 transition-transform duration-250 group-hover:scale-x-100" />
                      Track your application
                    </Link>
                  </li>
                </ul>
              </nav>
            </Reveal>

            {/* Column 3: Programs */}
            <Reveal delay={0.16}>
              <nav aria-label="Programs">
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-on-dark-faint mb-5">
                  PROGRAMS
                </h3>
                <div className="w-6 h-0.5 bg-accent mb-3" />
                <ul className="list-none p-0 m-0">
                  {treatments.map((t) => (
                    <li key={t.id}>
                      <Link
                        to="/treatments"
                        search={{ program: t.slug }}
                        className="group relative flex items-center min-h-[44px] w-fit py-[7px] text-[14.5px] leading-[1.5] text-on-dark-muted transition-all duration-250 hover:text-accent-contrast hover:translate-x-1.25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-[3px]"
                      >
                        <span className="absolute left-[-14px] top-1/2 -translate-y-1/2 w-2 h-[1.5px] bg-accent origin-left scale-x-0 transition-transform duration-250 group-hover:scale-x-100" />
                        {t.shortTitle || t.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </Reveal>

            {/* Column 4: Contact */}
            <Reveal delay={0.24}>
              <div className="flex flex-col gap-[18px]">
                <h3 className="text-[12px] font-semibold uppercase tracking-[0.14em] text-on-dark-faint mb-0.5">
                  GET IN TOUCH
                </h3>
                <div className="w-6 h-0.5 bg-accent -mt-2.5 mb-0.5" />

                {/* Phone */}
                <div className="flex gap-3 items-start">
                  <Phone
                    className="w-[18px] h-[18px] text-on-dark-accent mt-3 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col">
                    <a
                      href={`tel:${brand.phoneRaw}`}
                      aria-label={`Call ${brand.phone}`}
                      className="inline-flex items-center min-h-[44px] text-[15.5px] font-semibold text-on-dark hover:text-on-dark-accent transition-colors"
                    >
                      {brand.phone}
                    </a>
                    <span className="text-[12.5px] text-on-dark-faint">{brand.hours}</span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex gap-3 items-start">
                  <Mail
                    className="w-[18px] h-[18px] text-on-dark-accent mt-3 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <a
                    href={`mailto:${brand.email}`}
                    className="inline-flex items-center min-h-[44px] text-[14.5px] leading-[1.6] text-on-dark-muted hover:text-on-dark transition-colors"
                  >
                    {brand.email}
                  </a>
                </div>

                {/* Locations */}
                <div className="flex gap-3 items-start">
                  <MapPin
                    className="w-[18px] h-[18px] text-on-dark-accent mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <div className="flex flex-col gap-3">
                    {locations.map((loc, idx) => (
                      <div key={idx} className="flex flex-col">
                        <span className="text-[14.5px] leading-[1.6] text-on-dark-muted">
                          {loc.label}
                        </span>
                        <span className="text-[12.5px] text-on-dark-faint">{loc.note}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Online */}
                <div className="flex gap-3 items-start">
                  <Globe
                    className="w-[18px] h-[18px] text-on-dark-accent mt-0.5 flex-shrink-0"
                    aria-hidden="true"
                  />
                  <span className="text-[14.5px] leading-[1.6] text-on-dark-muted">
                    Online consultations across India
                  </span>
                </div>

                <div className="mt-2.5">
                  <Link
                    to="/assessment"
                    className="group h-[50px] w-full max-w-[260px] rounded-full bg-accent-strong text-on-accent text-[15px] font-semibold inline-flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(var(--accent-rgb), 0.34)]"
                  >
                    Start Assessment
                    <ArrowRight
                      className="w-[17px] h-[17px] transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Medical Disclaimer */}
          <Reveal delay={0.32}>
            <div className="mt-14 md:mt-11 w-full bg-on-dark-glass border border-on-dark-border rounded-2xl p-[18px_22px] md:p-[16px_18px]">
              <div className="flex gap-3 items-start">
                <Info
                  className="w-4 h-4 text-on-dark-faint mt-0.5 flex-shrink-0"
                  aria-hidden="true"
                />
                <p className="text-[12.5px] leading-[1.6] text-on-dark-faint max-w-[92ch]">
                  Nutrition and lifestyle guidance provided by GoRebalance is intended to support,
                  not replace, medical care. It is not a diagnosis or a prescription. Always consult
                  your physician regarding medical conditions, medications and before making changes
                  to prescribed treatment.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Bottom Bar */}
          <Reveal delay={0.4}>
            <div className="mt-10 md:mt-8 border-t border-on-dark-border py-[26px] md:py-[22px]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                {/* Copyright (Bottom on mobile) */}
                <div className="order-2 md:order-1 flex flex-col items-center md:items-start gap-1.5 text-[13px] text-on-dark-faint">
                  <span>© {currentYear} GoRebalance. All rights reserved.</span>
                  <span>
                    Designed and developed by{" "}
                    <a
                      href="https://thedreamteamservices.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center font-semibold text-on-dark-muted underline decoration-on-dark-border underline-offset-4 transition-colors hover:text-on-dark-accent hover:decoration-on-dark-accent"
                    >
                      Dream Team Services
                    </a>
                  </span>
                </div>

                {/* Legal Links (Top on mobile) */}
                <div className="order-1 md:order-2 flex flex-wrap items-center justify-center gap-[10px_0] text-[13px] text-on-dark-faint">
                  {legalLinks.map((link, idx) => (
                    <React.Fragment key={link.label}>
                      <a
                        href={link.href}
                        className="inline-flex items-center min-h-[44px] px-1 hover:text-on-dark-accent transition-colors"
                      >
                        {link.label}
                      </a>
                      {idx < legalLinks.length - 1 && (
                        <span
                          className="mx-3.5 w-[3px] h-[3px] rounded-full bg-on-dark-glass"
                          aria-hidden="true"
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Safe area padding for floating stack */}
              <div className="md:hidden h-[72px]" />
              <div style={{ paddingBottom: "max(0px, env(safe-area-inset-bottom))" }} />
            </div>
          </Reveal>
        </div>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "GoRebalance",
              logo: "https://gorebalance.in/logo.png",
              url: "https://gorebalance.in",
              telephone: brand.phone,
              email: brand.email,
              founder: {
                "@type": "Person",
                name: brand.practitioner,
              },
            },
            ...locations.map((loc) => ({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              name: `GoRebalance - ${loc.city}`,
              parentOrganization: {
                "@type": "Organization",
                name: "GoRebalance",
              },
              image: "https://gorebalance.in/og-image.jpg",
              telephone: brand.phone,
              email: brand.email,
              address: {
                "@type": "PostalAddress",
                addressLocality: loc.city,
                addressRegion: loc.state,
                addressCountry: "IN",
              },
              openingHours: "Mo-Sa 10:00-19:00",
              medicalSpecialty: "Nutrition",
            })),
          ]),
        }}
      />
    </footer>
  );
}
