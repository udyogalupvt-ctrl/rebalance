import * as React from "react";

/**
 * Subscribes to a CSS media query.
 *
 * Used where a breakpoint has to drive a JavaScript VALUE rather than a class
 * — framer-motion writes animated padding straight onto the style attribute,
 * so a Tailwind `sm:` class can never win against it.
 *
 * Returns false during the first render so the server and the client agree,
 * then settles on the real answer in an effect.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
