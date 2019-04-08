module.exports = () => (hook) => {
  const startDate = new Date(hook.result.registrationStartDate);
  const now = new Date();
  const endDate = new Date(hook.result.registrationEndDate);
  if (now > startDate && now < endDate) {
    hook.result.dataValues.millisTillOpening = 0;
  } else {
    hook.result.dataValues.millisTillOpening = startDate - now;
  }
};
