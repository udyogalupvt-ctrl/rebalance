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
import { iconNameOf } from "./icons";
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

/**
 * Makes a static seed record safe to write to Firestore.
 *
 * The treatments array carries `icon: Activity` -- a Lucide React component,
 * i.e. a function. Firestore cannot store one, and this SDK version does not
 * reject it cleanly: it threw
 *
 *   FIRESTORE INTERNAL ASSERTION FAILED: Unexpected state (ID: 3029)
 *   CONTEXT: {"type":"symbol"}
 *
 * which aborted the whole batch. The result was that `treatments` never
 * seeded, so the admin's treatments manager was permanently empty and the
 * public page silently fell back to the static list.
 *
 * Components are stored as their name instead, which resolveIcon() turns back
 * into a component at render time. Anything else unserialisable is dropped
 * rather than allowed to poison the batch.
 */
function toFirestoreSafe(value: unknown): unknown {
  if (value === null) return null;
  if (value === undefined) return undefined;

  const t = typeof value;
  if (t === "string" || t === "number" || t === "boolean") return value;
  if (t === "symbol" || t === "bigint") return undefined;

  // React components arrive as plain functions OR as forwardRef/memo objects
  // carrying a $$typeof symbol. Both are stored as their name; walking into
  // the object instead produced `{ render: "Activity" }`.
  if (t === "function" || (t === "object" && "$$typeof" in (value as object))) {
    return iconNameOf(value);
  }

  if (value instanceof Date) return value;

  if (Array.isArray(value)) {
    return value.map(toFirestoreSafe).filter((v) => v !== undefined);
  }

  if (t === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      const safe = toFirestoreSafe(v);
      if (safe !== undefined) out[k] = safe;
    }
    return out;
  }

  return undefined;
}

/**
 * Bump when the static seed data changes in a way the practice should see.
 *
 * Seeding used to run once — `if (snap.empty)` — and never again. That was
 * fine until the treatments were rewritten: a site that had already seeded the
 * old six programs would keep serving them forever, because the collection was
 * no longer empty. The practice would have had to retype seven programs by
 * hand to get the change the rewrite was for.
 *
 * With a version, a collection that was seeded under an older version is
 * RECONCILED rather than left alone (see below).
 */
const SEED_VERSION = 2;

export async function ensureSeeded(collectionName: string, staticData: readonly SeedItem[]) {
  if (SEED_LOCKS[collectionName]) return;
  SEED_LOCKS[collectionName] = true;

  try {
    const collRef = collection(db, collectionName);
    const snap = await getDocs(query(collRef, orderBy("order", "asc")));

    const seedDoc = (item: SeedItem, index: number, batch: ReturnType<typeof writeBatch>) => {
      const docId = typeof item.id === "string" && item.id ? item.id : `item_${index}`;
      batch.set(doc(db, collectionName, docId), {
        ...(toFirestoreSafe(item) as Record<string, unknown>),
        id: docId,
        order: index,
        published: true,
        seedVersion: SEED_VERSION,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    };

    if (snap.empty) {
      const batch = writeBatch(db);
      staticData.forEach((item, index) => seedDoc(item, index, batch));
      await batch.commit();
      console.info(`Seeded ${collectionName} with ${staticData.length} items.`);
      return;
    }

    /*
     * Reconcile a collection seeded under an older version.
     *
     * Two rules, both chosen so nothing the practice typed is ever destroyed:
     *
     *   1. A static item whose id is MISSING is added. That is how the new
     *      programs arrive.
     *   2. A document that came from an OLD SEED and is no longer in the
     *      static list is UNPUBLISHED, never deleted. It disappears from the
     *      public site but is still in the admin panel, so the change is
     *      reversible with one toggle.
     *
     * A document the practice created or edited themselves has no seedVersion
     * below the current one — hand-made rows are left completely alone.
     */
    const existing = new Map(snap.docs.map((d) => [d.id, d.data() as Record<string, unknown>]));
    const staticIds = new Set(
      staticData.map((item, i) => (typeof item.id === "string" && item.id ? item.id : `item_${i}`)),
    );

    const alreadyCurrent = snap.docs.some(
      (d) => (d.data()["seedVersion"] as number) >= SEED_VERSION,
    );
    if (alreadyCurrent) return;

    const batch = writeBatch(db);
    let changes = 0;

    staticData.forEach((item, index) => {
      const docId = typeof item.id === "string" && item.id ? item.id : `item_${index}`;
      if (!existing.has(docId)) {
        seedDoc(item, index, batch);
        changes += 1;
      }
    });

    for (const [id, data] of existing) {
      const fromOldSeed =
        typeof data["seedVersion"] === "number" || data["seedVersion"] === undefined;
      if (!staticIds.has(id) && fromOldSeed && data["published"] !== false) {
        batch.update(doc(db, collectionName, id), {
          published: false,
          seedVersion: SEED_VERSION,
          updatedAt: serverTimestamp(),
        });
        changes += 1;
      }
    }

    if (changes > 0) {
      await batch.commit();
      console.info(`Reconciled ${collectionName}: ${changes} document(s) updated.`);
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
  /*
   * No seeding any more.
   *
   * The three collections this seeded — treatments, testimonials and gallery
   * items — no longer have managers or public pages. Testimonials in
   * particular must not be seeded: the static array it used to copy into
   * Firestore was fifteen invented client stories, and seeding them would put
   * them back in the database the moment an admin page touched the
   * collection.
   */

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

/*
 * fetchPublished used to live here. It now lives in cms-public.ts, which
 * imports Firebase dynamically so the marketing pages do not carry the SDK on
 * their critical path. This module stays statically bound to Firebase because
 * it is only ever loaded inside the admin console.
 */
export { fetchPublished } from "./cms-public";
