import moment from 'moment';

import { AdminEventList } from '@tietokilta/ilmomasiina-models/src/schema';

// eslint-disable-next-line import/prefer-default-export
export function isEventInPast(event: Pick<AdminEventList[number], 'date' | 'endDate' | 'registrationEndDate'>) {
  const endDate = event.endDate ?? event.date ?? event.registrationEndDate;
  return moment().isAfter(moment(endDate!).add(7, 'days'));
}
