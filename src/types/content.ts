/**
 * Types derived from the content data itself.
 *
 * Using `(typeof x)[number]` rather than hand-written interfaces means these
 * can never drift out of sync with src/data/content.ts — adding a field to the
 * data widens the type automatically.
 */
import type {
  locations,
  symptoms,
  treatments,
  programJourney,
  programDetails,
} from "@/data/content";

export type Location = (typeof locations)[number];
export type Symptom = (typeof symptoms)[number];
export type Treatment = (typeof treatments)[number];
export type JourneyPhase = (typeof programJourney)[number];

/** One of the four levels of nutrition support, from the content brief. */
export type Program = (typeof programDetails)[number];

/**
 * A client story.
 *
 * Hand-written rather than inferred, because the seed array it used to be
 * inferred from is now empty. The practice has no published testimonials yet,
 * and the brief is explicit that placeholder ones must not be invented to fill
 * the gap — so the shape lives here and the data comes from Firestore once
 * real, consented stories are added through the admin panel.
 */
export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  initials?: string | undefined;
  location?: string | undefined;
  condition?: string | undefined;
  category?: string | undefined;
  duration?: string | undefined;
  rating?: number | undefined;
  /** A photograph uploaded through the admin panel. */
  photoUrl?: string | undefined;
  /** A YouTube link, played inline. See src/lib/youtube.ts. */
  videoUrl?: string | undefined;
  /** Longer account, shown on the testimonials page. */
  fullStory?: string | undefined;
  before?: readonly string[] | undefined;
  after?: readonly string[] | undefined;
  featured?: boolean | undefined;
}
