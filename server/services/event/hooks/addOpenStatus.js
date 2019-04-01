module.exports = () => (hook) => {
  const startDate = new Date(hook.result.registrationStartDate);
  const now = new Date();
  const endDate = new Date(hook.result.registrationEndDate);
  if (now > startDate && now < endDate) {
    hook.result.dataValues.isOpen = true;
  } else {
    hook.result.dataValues.isOpen = false;
  }
};
