/** Utility type that converts fields in the imported API to string. */
export type StringifyApi<T> = {
  [P in keyof T]: T[P] extends Date ? string : T[P];
};
