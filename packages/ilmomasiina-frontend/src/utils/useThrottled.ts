import { useEffect, useRef } from 'react';

/** Returns a version of the given callback that is called after the given delay.
 *
 * Further calls during the wait period delay the call, and the latest args are used.
 */
export default function useThrottled<T extends any[]>(callback: (...args: T) => void, ms: number) {
  const ref = useRef<number | undefined>();

  // clear on unmount
  useEffect(() => () => clearTimeout(ref.current), []);

  return (...args: T) => {
    window.clearTimeout(ref.current);
    ref.current = window.setTimeout(() => callback(...args), ms);
  };
}
