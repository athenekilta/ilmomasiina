import moment from 'moment';

import { AdminEvent } from '@tietokilta/ilmomasiina-models';

// eslint-disable-next-line import/prefer-default-export
export function isEventInPast(event: Pick<AdminEvent.List.Event, 'date' | 'endDate' | 'registrationEndDate'>) {
  const endDate = event.endDate ?? event.date ?? event.registrationEndDate;
  return moment().isAfter(moment(endDate!).add(7, 'days'));
}
