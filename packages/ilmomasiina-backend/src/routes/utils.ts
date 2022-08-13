import { StringifyApi } from '@tietokilta/ilmomasiina-models/src/schema/utils';

export function toDate<T extends string | null | undefined>(s: string | T):
T extends string ? Date : Exclude<T, string> {
  // @ts-ignore
  return (typeof s === 'string') ? new Date(s) : s;
}

export function toDateIfDefined(s?: string | null): Date | null | undefined {
  return typeof s === 'string' ? new Date(s) : s;
}

export function nullsToUndef<T>(val: T | null): T | undefined {
  return val !== null ? val : undefined;
}

export function stringifyDates<T extends object>(o: T): StringifyApi<T> {
  // const s = {};
  // for (const [key, val] of Object.entries(o)) {
  //   if (val instanceof Date) {
  //     // @ts-ignore
  //     s[key] = val.toISOString();
  //   } else if (typeof val !== 'object' || val == null) {
  //     // @ts-ignore
  //     s[key] = val;
  //   } else {
  //     console.log(val);
  //     // @ts-ignore
  //     s[key] = stringifyDates(val);
  //   }
  // }

  // @ts-ignore
  return o;
}
