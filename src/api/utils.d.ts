/** Utility type that converts fields in the imported API to string. */
export type StringifyApi<T> = {
  [P in keyof T]: (
    T[P] extends (infer E)[] ? StringifyApi<E>[]
      : T[P] extends Date | null ? (null extends T[P] ? string | null : string)
        : T[P] extends boolean | number | string | null ? T[P]
          : StringifyApi<T[P]>
  );
};
