import { useEffect, useState } from "react";

type MediaQuery = {
  breakpoint: keyof typeof breakpoints;
  type: "min" | "max";
};

const breakpoints = {
  sm: `640px`,
  md: `768px`,
  lg: `1024px`,
  xl: `1280px`,
} as const;

export function useMobile(props: MediaQuery): boolean {
  const { breakpoint, type } = props;
  const query = `(${type}-width: ${breakpoints[breakpoint]})`;

  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window !== "undefined") return window.matchMedia(query).matches;

    return false;
  });

  useEffect(() => {
    const media = window.matchMedia(query);
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(media.matches);

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}
