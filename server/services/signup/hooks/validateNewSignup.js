const moment = require('moment');
const _ = require('lodash');

const signupsAllowed = (signupOpens, signupCloses) => {
  const now = moment();

  const isOpened = now.isSameOrAfter(moment(signupOpens));
  const isClosed = now.isAfter(moment(signupCloses));
  const bothNull = (_.isNull(signupOpens) && _.isNull(signupCloses));

  return (isOpened && !isClosed) || bothNull;
};


module.exports = () => (hook) => {
  const quotaId = hook.data.quotaId;

  const isInt = n => n % 1 === 0;

  if (quotaId && isInt(quotaId)) {
    const quotas = hook.app.get('models').quota;

    // Check is quota open for signups
    return quotas.findById(quotaId)
      .catch(() => {
        throw new Error('Quota doesn\'t exist.');
      })
      .then((quota) => {
        if (!quota) {
          throw new Error('Quota ' + quotaId + 'doesn\'t exist.');
        }
        const events = hook.app.get('models').event;
        return events.findById(quota.eventId)
          .catch(() => {
            throw new Error('Event doesn\'t exist.');
          })
          .then((event) => {
            if (!signupsAllowed(event.registrationStartDate, event.registrationEndDate)) {
              throw new Error('Signups closed for this event.');
            }
          });
      });
  }
  throw new Error('Missing valid quota id.');
};
