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
  testimonialsFull,
} from "@/data/content";

export type Location = (typeof locations)[number];
export type Symptom = (typeof symptoms)[number];
export type Treatment = (typeof treatments)[number];
export type JourneyPhase = (typeof programJourney)[number];
/**
 * A client story.
 *
 * The static array is the shape's source of truth, widened with the media the
 * practice can attach from the admin panel. Those fields exist only on
 * Firestore documents — no seeded story has one — so they are optional here
 * rather than added to the seed data as empty strings.
 */
export type Testimonial = (typeof testimonialsFull)[number] & {
  /** A photograph uploaded through the admin panel. */
  photoUrl?: string;
  /** A YouTube link, played inline. See src/lib/youtube.ts. */
  videoUrl?: string;
  /** Longer account, shown on the testimonials page. */
  fullStory?: string;
  before?: readonly string[];
  after?: readonly string[];
  featured?: boolean;
};
