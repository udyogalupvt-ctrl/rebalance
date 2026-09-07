/**
 * The site's photography, in one auditable place.
 *
 * Every photograph used anywhere on the marketing site resolves through this
 * file. That is deliberate: the imagery had drifted into a scatter of ad-hoc
 * URLs pasted into components, and the results showed — a symptom card for
 * "irregular bowels" was illustrated with a plate of roast vegetables, the
 * hero ran a dark, murky kitchen photograph nobody could identify, and the
 * founder's own biography was illustrated with a stock portrait of somebody
 * else entirely.
 *
 * Two rules for anything added here:
 *
 *   1. It must be BRIGHT. The practice's palette is warm porcelain and blush;
 *      a dim, heavily-shadowed photograph fights it and reads as cheap.
 *   2. It must be TRUE. The caption and the alt text have to describe what is
 *      genuinely in the frame, not what we wish were in it.
 *
 * The two real photographs — the practitioner at her desk — are local files
 * and are always preferred over anything stock.
 */

const unsplash = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&q=75&w=${w}`;

/** The practice's own photography. Never replace these with stock. */
export const OWN = {
  practitioner: "/founder.jpg",
  practitionerSmall: "/founder-sm.jpg",
};

/**
 * One image per treatment program, chosen for what is actually in the frame:
 * green produce for the gut work, a warm soothing bowl for reflux, gentle
 * yoghurt and fruit for IBD, and so on.
 */
export const TREATMENT_IMAGES: Record<string, string> = {
  "gut-health": unsplash("photo-1543362906-acfc16c67564"), // green vegetables, laid out on a pale green ground
  "acid-reflux-gerd": unsplash("photo-1547592166-23ac45744acd"), // a soothing bowl of tomato soup
  "ibd-support": unsplash("photo-1654923064926-be7e64267a31"), // yoghurt with berries and oats — gentle food
  "pcos-pcod": unsplash("photo-1602881916963-5daf2d97c06e"), // a bright salad bowl on a blush ground
  "pregnancy-nutrition": unsplash("photo-1494390248081-4e521a5940db"), // fruit and yoghurt bowls, soft morning light
  "diabetes-metabolic": unsplash("photo-1512621776951-a57141f2eefd"), // a balanced wholegrain bowl
  "weight-loss": unsplash("photo-1547592180-85f173990554"), // a portioned grain bowl on linen
};

export const FALLBACK_TREATMENT_IMAGE = TREATMENT_IMAGES["gut-health"]!;

export function treatmentImage(slug: string | undefined): string {
  if (!slug) return FALLBACK_TREATMENT_IMAGE;
  return TREATMENT_IMAGES[slug] ?? FALLBACK_TREATMENT_IMAGE;
}

/** Wide, bright supporting photography for section backgrounds and cards. */
export const SUPPORTING = {
  /** A market stall of fresh produce — used behind the clinic map card. */
  produceMarket: unsplash("photo-1591586116988-62fe65164f8d", 1400),
  /** Hands offering a bowl of grains and vegetables. */
  handsWithBowl: unsplash("photo-1644704170910-a0cdf183649b", 1200),
  /** Two women cooking flatbreads together. */
  cookingTogether: unsplash("photo-1783245255807-cdc7ccb20942", 1200),
};
