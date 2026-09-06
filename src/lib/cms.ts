import type { FirestoreError } from "firebase/firestore";
import type { FirestoreDate } from "@/types/admin";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  orderBy,
  writeBatch,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import {
  treatments as staticTreatments,
  testimonialsFull as staticTestimonials,
  galleryFull as staticGallery,
} from "../data/content";

/**
 * A document as stored in a CMS collection. The index signature is `unknown`
 * rather than `any` so callers must narrow before use; the known fields stay
 * typed.
 */
export interface CMSDocument {
  id: string;
  order: number;
  published: boolean;
  createdAt: FirestoreDate;
  updatedAt: FirestoreDate;
  [key: string]: unknown;
}

/** Shape the static seed arrays share: a record that may carry an id. */
/**
 * The seed arrays are heterogeneous (treatments, testimonials, gallery items).
 * Only `id` is read directly, so that is all the type needs to promise — an
 * index signature would reject the interface-typed arrays that get passed in.
 */
type SeedItem = { id?: unknown };

const SEED_LOCKS: Record<string, boolean> = {};

export async function ensureSeeded(collectionName: string, staticData: readonly SeedItem[]) {
  if (SEED_LOCKS[collectionName]) return;
  SEED_LOCKS[collectionName] = true;

  try {
    const collRef = collection(db, collectionName);
    const snap = await getDocs(query(collRef, orderBy("order", "asc")));

    if (snap.empty) {
      console.log(`Seeding ${collectionName}...`);
      const batch = writeBatch(db);

      staticData.forEach((item, index) => {
        // Use the existing ID if present, otherwise let Firestore generate one (or use a simple hash/index)
        const docId = typeof item.id === "string" && item.id ? item.id : `item_${index}`;
        const docRef = doc(db, collectionName, docId);

        batch.set(docRef, {
          ...item,
          id: docId,
          order: index,
          published: true, // published by default during seed
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      console.log(`Seeded ${collectionName} with ${staticData.length} items.`);
    }
  } catch (err) {
    console.error(`Error seeding ${collectionName}:`, err);
  }
}

export function subscribeToCMS(
  collectionName: string,
  onData: (data: CMSDocument[]) => void,
  onError: (err: FirestoreError) => void,
) {
  // Fire and forget seeding
  if (collectionName === "treatments") ensureSeeded("treatments", staticTreatments);
  if (collectionName === "testimonials") ensureSeeded("testimonials", staticTestimonials);
  if (collectionName === "galleryItems") ensureSeeded("galleryItems", staticGallery);

  const q = query(collection(db, collectionName), orderBy("order", "asc"));
  return onSnapshot(
    q,
    (snap) => {
      const docs = snap.docs.map((d) => ({ ...d.data(), id: d.id }) as CMSDocument);
      onData(docs);
    },
    onError,
  );
}

// Caching layer for public site
const publicCache: Record<string, { data: unknown[]; timestamp: number }> = {};
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export async function fetchPublished<T>(
  collectionName: string,
  fallbackData: readonly T[],
): Promise<T[]> {
  const now = Date.now();
  const cached = publicCache[collectionName];
  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.data as T[];
  }

  try {
    const q = query(collection(db, collectionName), orderBy("order", "asc"));
    const snap = await getDocs(q);

    if (snap.empty) {
      return [...fallbackData];
    }

    const docs = snap.docs
      .map((d) => ({ ...d.data(), id: d.id }) as CMSDocument)
      .filter((d) => d.published !== false);

    publicCache[collectionName] = { data: docs, timestamp: now };
    // Documents are seeded from the same static shape the caller passes as a
    // fallback, so they are interchangeable at the call site.
    return docs as unknown as T[];
  } catch {
    console.warn(`Failed to fetch ${collectionName} from Firestore, using fallback.`);
    return [...fallbackData];
  }
}
