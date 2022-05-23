import { useRef } from 'react';

/**
 * Modified from https://github.com/reduxjs/react-redux/blob/master/src/utils/shallowEqual.ts
 * @copyright 2015-present Dan Abramov
 * @license MIT
 */
function shallowEqual(a: any, b: any) {
  if (Object.is(a, b)) return true;

  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    const key = keysA[i];
    if (!Object.prototype.hasOwnProperty.call(b, key) || !Object.is(a[key], b[key])) return false;
  }
  return true;
}

/** Returns the given object. Returns a previously used object, if shallow-equal to the current one. */
export default function useShallowMemo<T>(value: T): T {
  const ref = useRef<T>();
  if (!shallowEqual(ref.current, value)) ref.current = value;
  return ref.current as T;
}
