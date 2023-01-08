/** Converts given value to a Date if it is a string, and otherwise just passthroughs the input */
export function toDate<T>(s: T): Date | Exclude<T, string> {
  return typeof s === 'string' ? new Date(s) : s as Exclude<T, string>;
}

/** Utility type that converts fields in the imported API to string. */
export type StringifyApi<T> = {
  [P in keyof T]: (
    // all arrays are stringified recursively
    T[P] extends (infer E)[] ? StringifyApi<E>[]
      // Date | null --> string | null
      // Date --> string
      // (also matches "x: null", but that's an useless type anyway)
      : T[P] extends Date | null ? (null extends T[P] ? string | null : string)
        // basic types: any subset of boolean | number | string | null --> itself
        : T[P] extends boolean | number | string | null ? T[P]
          // other types (essentially, objects) are stringified recursively
          : StringifyApi<T[P]>
  );
};

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
