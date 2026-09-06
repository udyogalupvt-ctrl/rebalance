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
