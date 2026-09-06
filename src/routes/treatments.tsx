import { createFileRoute } from "@tanstack/react-router";
import TreatmentsPage from "@/pages/Treatments";

type TreatmentsSearch = { program?: string };

export const Route = createFileRoute("/treatments")({
  /*
   * `?program=<slug>` opens that program's card.
   *
   * The treatment cards on the home page and the Programs list in the footer
   * used to link to /treatments/<slug>, which has no route -- every one of
   * them landed on the 404 page. The expandable cards here already carry the
   * conditions, what's involved and the timeline, so the fix is to open the
   * right card rather than duplicate all of it on a second page.
   */
  validateSearch: (search: Record<string, unknown>): TreatmentsSearch => {
    const raw = search["program"];
    if (typeof raw !== "string") return {};
    const slug = raw.trim().slice(0, 64);
    return /^[a-z0-9-]{2,64}$/i.test(slug) ? { program: slug } : {};
  },
  component: TreatmentsPage,
});
