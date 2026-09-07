import type { CMSDocument } from "./cms";

/**
 * Reading published CMS content from the public site.
 *
 * This is a separate module from `cms.ts` for one reason: it imports Firebase
 * DYNAMICALLY. The Firebase SDK is 488 kB (145 kB gzipped), the single
 * heaviest thing in the build, and it was on the critical path of every
 * marketing page — a visitor could not see the home page until it had
 * downloaded, parsed and initialised, even though every section on that page
 * renders perfectly from the static content shipped in the bundle.
 *
 * Now the page paints from the static fallback immediately and the Firestore
 * copy arrives a moment later, replacing it only if the practice has actually
 * edited something. `cms.ts` keeps its static imports because it is only ever
 * loaded inside the admin console, which needs Firebase anyway.
 */

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
    const [{ collection, getDocs, orderBy, query }, { db }] = await Promise.all([
      import("firebase/firestore"),
      import("./firebase"),
    ]);

    const snap = await getDocs(query(collection(db, collectionName), orderBy("order", "asc")));

    if (snap.empty) {
      return [...fallbackData];
    }

    const all = snap.docs.map((d) => ({ ...d.data(), id: d.id }) as CMSDocument);

    /*
     * Prefer the shipped content over a pre-versioning seed.
     *
     * Reconciliation (ensureSeeded) only runs from the admin panel, because
     * writing to these collections requires an admin — a visitor's write
     * would be refused by the security rules. So on a site whose Firestore
     * was seeded before SEED_VERSION existed, the public pages would keep
     * serving the OLD content until somebody happened to open the admin.
     *
     * When not a single document carries a seedVersion, the whole collection
     * is a pre-versioning seed that nobody has touched through the current
     * editor, and the code is the more recent source of truth. The documents
     * are left exactly as they are; the next admin visit reconciles them
     * properly, after which they carry a seedVersion and win again.
     */
    const anyVersioned = all.some((d) => typeof d["seedVersion"] === "number");
    if (!anyVersioned && fallbackData.length > 0) {
      return [...fallbackData];
    }

    const docs = all.filter((d) => d.published !== false);

    publicCache[collectionName] = { data: docs, timestamp: now };
    // Documents are seeded from the same static shape the caller passes as a
    // fallback, so they are interchangeable at the call site.
    return docs as unknown as T[];
  } catch {
    console.warn(`Failed to fetch ${collectionName} from Firestore, using fallback.`);
    return [...fallbackData];
  }
}
