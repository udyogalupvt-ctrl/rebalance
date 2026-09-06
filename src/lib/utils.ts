import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Validates a post-login redirect target.
 *
 * The value arrives from `?redirect=` in the URL, so it is user-controlled even
 * though it is set from `location.pathname` on the way in. Only same-origin
 * absolute paths are accepted; anything else falls back to `fallback`.
 *
 * Rejected: absolute URLs ("https://evil.example"), protocol-relative
 * ("//evil.example"), backslash variants that some browsers normalise to a
 * host ("/\evil.example", "/\evil.example"), and anything not starting "/".
 */
export function safeRedirect(value: unknown, fallback = "/admin"): string {
  if (typeof value !== "string" || value.length === 0) return fallback;

  // Reject control characters and whitespace, which are used to slip past
  // naive prefix checks.
  // eslint-disable-next-line no-control-regex
  if (/[\s\u0000-\u001F\u007F]/.test(value)) return fallback;

  if (!value.startsWith("/")) return fallback;
  if (value.startsWith("//")) return fallback;
  if (value.startsWith("/\\")) return fallback;

  return value;
}
