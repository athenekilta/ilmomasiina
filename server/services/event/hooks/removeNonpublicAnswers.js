module.exports = () => (hook) => {
  if (!hook.result.dataValues.answersPublic) {
    if (hook.result.quota) {
      hook.result.dataValues.quota = hook.result.dataValues.quota.map((quota) => {
        if (quota.dataValues.signups) {
          quota.dataValues.signups = null;
        }
        return quota;
      });
    }
  }

  return hook;
};
