import {
  Activity,
  BatteryLow,
  CalendarCheck,
  CalendarHeart,
  Candy,
  ClipboardList,
  Ear,
  FileText,
  Flame,
  Gauge,
  HeartHandshake,
  HeartPulse,
  MapPin,
  MessageCircle,
  Microscope,
  NotebookPen,
  Phone,
  RefreshCw,
  Salad,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Timer,
  TrendingUp,
  Users,
  Utensils,
  Video,
  Wind,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * The icons a stored record is allowed to name.
 *
 * This used to be `import * as LucideIcons from "lucide-react"` with a lookup
 * by string key. That is a dynamic lookup into a namespace object, so no
 * bundler can prove which members are unused — every one of Lucide's ~1,600
 * icons was linked into the build. It was the single largest thing in the
 * bundle: 930 kB of vendor JavaScript, of which roughly thirty icons were
 * ever rendered.
 *
 * An explicit map costs one line per icon and lets the bundler drop the rest.
 * The set below is every name that appears in src/data/content.ts plus every
 * option offered by the admin panel's icon picker; anything else falls back
 * rather than rendering nothing.
 *
 * Adding an icon to the admin picker means adding it here too — the picker
 * imports ICON_NAMES from this file so the two cannot drift.
 */
const ICON_REGISTRY = {
  Activity,
  BatteryLow,
  CalendarCheck,
  CalendarHeart,
  Candy,
  ClipboardList,
  Ear,
  FileText,
  Flame,
  Gauge,
  HeartHandshake,
  HeartPulse,
  MapPin,
  MessageCircle,
  Microscope,
  NotebookPen,
  Phone,
  RefreshCw,
  Salad,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Timer,
  TrendingUp,
  Users,
  Utensils,
  Video,
  Wind,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICON_REGISTRY;

/** Every name the admin icon picker may offer. */
export const ICON_NAMES = Object.keys(ICON_REGISTRY) as IconName[];

/**
 * Resolves an icon by name.
 *
 * Call sites previously did `(LucideIcons as any)[name]`, which silently
 * returned undefined for a typo and crashed at render. This narrows the lookup
 * and always returns a usable component.
 */
export function resolveIcon(name: string | undefined, fallback: LucideIcon = Sparkles): LucideIcon {
  if (!name) return fallback;
  return ICON_REGISTRY[name as IconName] ?? fallback;
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
export function toIconComponent(value: unknown, fallback: LucideIcon = Sparkles): LucideIcon {
  // Already a usable component: a function, or a React exotic object.
  if (typeof value === "function") return value as LucideIcon;
  if (value && typeof value === "object" && "$$typeof" in (value as object)) {
    return value as LucideIcon;
  }
  return resolveIcon(iconNameOf(value), fallback);
}
