import { StringifyApi } from '../../../utils';
import { AdminCheckSlugResponse } from './get';

export type AdminSlugServiceTypes = AdminCheckSlugResponse;

export namespace AdminSlug {
  export type Check = StringifyApi<AdminCheckSlugResponse>;
}
