import { StringifyApi } from '@tietokilta/ilmomasiina-models/src/schema/utils';

/** Converts given value to a Date if it is a string, and otherwise just passthroughs the input */
export function toDate<T>(s: T): Date | Exclude<T, string> {
  return typeof s === 'string' ? new Date(s) : s as Exclude<T, string>;
}

/** Returns `undefined` when passed `null`, and the argument otherwise. */
export function nullsToUndef<T>(val: T | null): T | undefined {
  return val !== null ? val : undefined;
}

/** Recursively converts all `Date` objects in the given object to strings. */
export function stringifyDates<T extends object>(obj: T): StringifyApi<T> {
  const result: any = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val instanceof Date) {
      result[key] = val.toISOString();
    } else if (Array.isArray(val)) {
      result[key] = val.map(stringifyDates);
    } else if (typeof val === 'object' && val !== null) {
      result[key] = stringifyDates(val);
    } else {
      result[key] = val;
    }
  }
  return result;
}
