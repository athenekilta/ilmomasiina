import { AdminListCategoriesResponse } from '@tietokilta/ilmomasiina-models/src/services/admin/categories/list';
import { Event } from '../../../models/event';

export default async function getCategoriesList(): Promise<AdminListCategoriesResponse> {
  const results = await Event.findAll({
    attributes: ['category'],
    group: ['category'],
  });
  return results.map((event) => (event as any).category);
}
