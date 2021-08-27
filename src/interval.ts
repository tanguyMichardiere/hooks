import { useEffect, useRef } from "react";

/**
 * Usage:
 *
 * ```tsx
 * const [count, setCount] = useState(0);
 * useInterval(function() {
 *   setCount((count) => count + 1);
 * }, 1000);
 * return <div>{count}</div>;
 * ```
 *
 * credit: https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */
export function useInterval(callback: () => void, ms: number | null): void {
  const savedCallback = useRef<() => void>();

  useEffect(
    function () {
      savedCallback.current = callback;
    },
    [callback]
  );

  useEffect(
    function () {
      if (savedCallback.current !== undefined && ms !== null) {
        const handle = setInterval(savedCallback.current, ms);
        return function () {
          clearInterval(handle);
        };
      }
      return undefined;
    },
    [ms]
  );
}
