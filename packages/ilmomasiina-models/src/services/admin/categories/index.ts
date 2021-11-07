import { StringifyApi } from '../../../utils';
import { AdminListCategoriesResponse } from './list';

export type AdminCategoriesServiceTypes = AdminListCategoriesResponse;

export namespace AdminCategory {
  export type List = StringifyApi<AdminListCategoriesResponse>;
}
