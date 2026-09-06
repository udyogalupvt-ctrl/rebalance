import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Resolves an icon by name from the lucide set.
 *
 * Call sites previously did `(LucideIcons as any)[name]`, which silently
 * returned undefined for a typo and crashed at render. This narrows the lookup
 * and always returns a usable component.
 */
export function resolveIcon(
  name: string | undefined,
  fallback: LucideIcon = LucideIcons.Sparkles,
): LucideIcon {
  if (!name) return fallback;
  const registry = LucideIcons as unknown as Record<string, LucideIcon | undefined>;
  return registry[name] ?? fallback;
}

/**
 * The name of an icon, whatever shape it arrives in.
 *
 * Lucide icons are forwardRef *objects*, not plain functions, so a naive
 * serialiser walks into one and stores `{ render: "Activity" }`. This accepts
 * a component, a name, or that map, so seeded records written before the
 * serialiser was fixed still resolve.
 */
export function iconNameOf(value: unknown): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;

  if (typeof value === "function") {
    const fn = value as { displayName?: string; name?: string };
    return fn.displayName || fn.name || undefined;
  }

  if (typeof value === "object") {
    const o = value as {
      displayName?: string;
      name?: string;
      render?: unknown;
      type?: unknown;
    };
    if (typeof o.displayName === "string") return o.displayName;
    if (typeof o.name === "string") return o.name;
    // forwardRef stores the implementation under `render`; memo under `type`.
    const inner = o.render ?? o.type;
    if (inner) return iconNameOf(inner);
  }

  return undefined;
}

/** Accepts a component, a name, or a serialised map, and returns a component. */
export function toIconComponent(
  value: unknown,
  fallback: LucideIcon = LucideIcons.Sparkles,
): LucideIcon {
  // Already a usable component: a function, or a React exotic object.
  if (typeof value === "function") return value as LucideIcon;
  if (value && typeof value === "object" && "$$typeof" in (value as object)) {
    return value as LucideIcon;
  }
  return resolveIcon(iconNameOf(value), fallback);
}
