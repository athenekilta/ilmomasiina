import { StringifyApi } from '../../../utils';
import { AdminCheckSlugResponse } from './get';

export type AdminSlugServiceResponses = AdminCheckSlugResponse;

export namespace AdminSlug {
  export type Check = StringifyApi<AdminCheckSlugResponse>;
}
