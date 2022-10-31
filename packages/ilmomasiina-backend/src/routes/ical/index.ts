import { ServiceMethods } from '@feathersjs/feathers';
import { createEvents, DateArray } from 'ics';
import { Op } from 'sequelize';

import config from '../../config';
import { IlmoApplication } from '../../defs';
import { Event } from '../../models/event';

function dateToArray(date: Date) {
  return [
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
  ] as DateArray;
}

/** Domain name for generating iCalendar UIDs.
 * @see https://datatracker.ietf.org/doc/html/rfc5545#section-3.8.4.7
 */
const uidDomain = new URL(config.baseUrl ?? 'http://localhost').hostname;

export const icalService: Partial<ServiceMethods<any>> = {
  async find() {
    const events = await Event.scope('user').findAll({
      where: {
        listed: true,
        // only events, not signup-only
        date: { [Op.ne]: null },
        // ignore legacy events with no end date
        endDate: { [Op.ne]: null },
      },
      order: [
        ['date', 'ASC'],
        ['registrationEndDate', 'ASC'],
        ['title', 'ASC'],
      ],
    });

    const { error, value } = createEvents(events.map((event) => ({
      calName: config.icalCalendarName,
      uid: `${event.id}@${uidDomain}`,
      start: dateToArray(event.date!),
      startInputType: 'utc',
      end: dateToArray(new Date(event.endDate!)),
      endInputType: 'utc',
      title: event.title,
      description: event.description || undefined, // TODO convert markdown
      location: event.location || undefined,
      categories: event.category ? [event.category] : undefined,
      url: config.eventDetailsUrl.replace(/\{slug\}/g, event.slug),
    })));

    if (error !== null) throw new Error(`Failed to generate iCalendar: ${error}`);
    return value;
  },
};

export default function setupIcalService(this: IlmoApplication) {
  const app = this;

  app.use('/api/ical', icalService);
}
