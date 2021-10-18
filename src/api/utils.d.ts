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
