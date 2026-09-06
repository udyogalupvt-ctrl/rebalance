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
export type Testimonial = (typeof testimonialsFull)[number];
