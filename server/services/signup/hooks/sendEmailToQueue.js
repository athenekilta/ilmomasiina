const _ = require('lodash');
const EmailService = require('../../../mail');
const moment = require('moment');

module.exports = () => (hook) => {
  const models = hook.app.get('models');
  const sequelize = hook.app.get('sequelize');
  const quotaId = hook.result.dataValues.quotaId;
  return models.quota.findById(quotaId)
    .then((quota) => {
      const query = {
        attributes: ['id', 'openQuotaSize', 'signupsPublic', 'title', 'location'],
        distinct: true,
        where: {
          id: quota.eventId,
        },
        // Include quotas of event and count of signups
        include: [{
          model: models.quota,
          attributes: [
            'id',
            'size',
          ],
          include: [{
            model: models.signup,
            attributes: [],

          }],
        }],
        group: [sequelize.col('event.id'), sequelize.col('quota.id')],
      };

      return models.event.findOne(query)
        .then((event) => {
          const currentQuota = _.find(event.quota, { dataValues: { id: quotaId } }).dataValues;
          return models.signup.findAndCountAll({
            where: {
              quotaId: quotaId
            },
            limit: 1,
            offset: currentQuota.size + event.openQuotaSize - 1 // notify the last person in line
          })
            .then(signup => {
              if (signup.count >= currentQuota.size) {
                // there are people in the queue
                const personToNotify = signup.rows[0].dataValues
                console.log(personToNotify)
                const params = {
                  event: event,
                  date: moment(event.date).tz('Europe/Helsinki').format('DD.MM.YYYY HH:mm'),
                };
                EmailService.sendQueueEmail(personToNotify.email, params);
              }

            })
            .catch(exc => {
              console.log("exc", exc)
            })

        });
    });
};
