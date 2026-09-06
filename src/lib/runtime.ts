/** Narrows an unknown catch value to a readable message. */
export function errorMessage(err: unknown, fallback = "Something went wrong."): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === "string" && err) return err;
  return fallback;
}

/** Reads a `code` property off an unknown catch value (Firebase auth errors). */
export function errorCode(err: unknown): string {
  if (typeof err === "object" && err !== null && "code" in err) {
    const code = (err as { code?: unknown }).code;
    if (typeof code === "string") return code;
  }
  return "";
}

/** Converts any Firestore date representation to a JS Date. */
export function toDate(value: unknown): Date {
  if (value && typeof value === "object" && "toDate" in value) {
    const fn = (value as { toDate?: unknown }).toDate;
    if (typeof fn === "function") return fn.call(value) as Date;
  }
  if (value instanceof Date) return value;
  if (typeof value === "string" || typeof value === "number") return new Date(value);
  return new Date(NaN);
}

/** Converts any Firestore date representation to epoch milliseconds. */
export function toMillis(value: unknown): number {
  const d = toDate(value);
  const t = d.getTime();
  return Number.isNaN(t) ? 0 : t;
}
