import { brand } from "@/data/content";

/*
 * The `af-*` styles this page uses live in assessment.css.
 *
 * That stylesheet used to be loaded on every page, because it was imported at
 * the top of a route module and every route module is pulled into the initial
 * graph. Splitting the assessment into its own chunk moved 2,500 lines of CSS
 * off the marketing critical path — and took these styles with it, leaving
 * this page, the tracking page and the whole admin console unstyled.
 *
 * Each module that needs it now imports it directly, so it travels with
 * whichever chunk actually loads first and never with the home page.
 */
import "@/styles/assessment.css";

export type LegalSection = { heading: string; body: string[] };

/**
 * Shared shell for the privacy, terms and disclaimer pages.
 *
 * These were linked from the footer but had no routes, so all three returned
 * the 404 page — on a site that collects medical history and payment
 * screenshots, which is exactly where a visitor goes looking for them.
 *
 * The content below describes what this application actually does: the fields
 * the assessment form collects, where they are stored (Firestore), and where
 * payment screenshots go (Cloudinary). It is written to be accurate rather
 * than boilerplate, but it is NOT legal advice and should be reviewed by a
 * professional before launch — see the notice rendered at the foot of each
 * page.
 */
export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
  updated,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  updated: string;
}) {
  return (
    <div className="af-legal-page">
      <div className="container-narrow">
        <p className="fs-eyebrow af-legal-eyebrow">{eyebrow}</p>
        <h1 className="fs-h2 af-legal-title">{title}</h1>
        <p className="fs-sub af-legal-intro">{intro}</p>
        <p className="af-legal-updated">Last updated {updated}</p>

        {sections.map((s) => (
          <section key={s.heading} className="af-legal-section">
            <h2 className="fs-h4 af-legal-heading">{s.heading}</h2>
            {s.body.map((p, i) => (
              <p key={i} className="af-legal-body">
                {p}
              </p>
            ))}
          </section>
        ))}

        <section className="af-legal-section">
          <h2 className="fs-h4 af-legal-heading">Contact</h2>
          <p className="af-legal-body">
            Questions about this page, or a request about your own data, can go to{" "}
            <a href={`mailto:${brand.email}`}>{brand.email}</a> or {brand.phone}. The practice is
            based in Kakinada, Andhra Pradesh.
          </p>
        </section>

        <p className="af-legal-notice">
          This page describes how the site currently works and is provided for information. It has
          not been reviewed by a lawyer. Please have it checked against your obligations under the
          Digital Personal Data Protection Act, 2023 before relying on it.
        </p>
      </div>
    </div>
  );
}
