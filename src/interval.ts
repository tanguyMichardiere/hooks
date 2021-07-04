import { useEffect, useRef } from "react";

/**
 * credit: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export function useInterval(callback: () => void, delay: number | null): void {
  const savedCallback = useRef<() => void>();

  useEffect(
    function () {
      savedCallback.current = callback;
    },
    [callback]
  );

  useEffect(
    function () {
      if (savedCallback.current !== undefined && delay !== null) {
        const handle = setInterval(savedCallback.current, delay);
        return function () {
          clearInterval(handle);
        };
      }
      return undefined;
    },
    [delay]
  );
}
