import { RefObject, useEffect, useRef } from "react";

import Parallax from "parallax-js";

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  mounted?: boolean,
): RefObject<T | null> {
  const scope = useRef<T>(null);

  useEffect(() => {
    if (!scope.current) return;

    const p = new Parallax(scope.current, {
      relativeInput: true,
      clipRelativeInput: true,
    });

    return () => p.destroy();
  }, [mounted]);

  return scope;
}
