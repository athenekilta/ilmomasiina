import { HookContext } from '@feathersjs/feathers';
import moment from 'moment';
import { Model } from 'sequelize';
import EmailService from '../../../mail';
import { Event } from '../../../models/event';
import { Signup } from '../../../models/signup';

export default () => async (hook: HookContext<Signup>) => {
  const signup = hook.result!;

  const currentQuota = await signup.getQuota({
    include: [
      {
        model: Event as typeof Model,
      },
    ],
  })!;
  const event = currentQuota.event!;

  // TODO: fix this, currently doesn't handle open quota correctly
  const { count, rows } = await Signup.findAndCountAll({
    where: { quotaId: currentQuota.id } /* TODO */ as any,
    // Only retrieve the entry that just got accepted from the queue
    limit: 1,
    offset: currentQuota.size + event.openQuotaSize - 1,
  });
  if (count >= currentQuota.size) {
    // There is someone that just got accepted from the queue, inform them
    const promotedFromQueue = rows[0];
    const params = {
      event,
      date: moment(event.date).tz('Europe/Helsinki').format('DD.MM.YYYY HH:mm'),
    };
    EmailService.sendPromotedFromQueueEmail(promotedFromQueue.email, params);
  }
};
