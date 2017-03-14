const moment = require('moment');
const _ = require('lodash');

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
        const signupsAllowed = (signupOpens, signupCloses) => {
          const now = moment();

          const isOpened = now.isSameOrAfter(moment(signupOpens));
          const isClosed = now.isAfter(moment(signupCloses));
          const bothNull = (_.isNull(signupOpens) && _.isNull(signupCloses));

          return (isOpened && !isClosed) || bothNull;
        };

        if (!signupsAllowed(quota.signupOpens, quota.signupCloses)) {
          throw new Error('Signups closed for this quota.');
        }
      });
  }
  throw new Error('Missing valid quota id.');
};
