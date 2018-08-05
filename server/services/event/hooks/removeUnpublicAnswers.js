module.exports = () => (hook) => {
  // console.log(hook.result.answersPublic)
  // if (!hook.result.answersPublic) {
  if (hook.result.quota) {
    hook.result.quota.map((quota) => {
      quota.testi = 'asd';
      if (quota.signups) {
        quota.signups = [];
      }
    });
  }
  // }
};
