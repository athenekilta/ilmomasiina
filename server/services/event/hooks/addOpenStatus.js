module.exports = () => hook => {
  const startDate = new Date(hook.result.registrationStartDate);
  const now = new Date();
  const endDate = new Date(hook.result.registrationEndDate);
  if (now > startDate) {
    hook.result.dataValues.millisTillOpening = 0;
  } else {
    hook.result.dataValues.millisTillOpening = startDate - now;
  }
  if (now > endDate) {
    hook.result.dataValues.registrationClosed = true;
  }
};
