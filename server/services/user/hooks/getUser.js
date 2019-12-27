module.exports = () => hook => {
  hook.result = hook.params.user;

  return hook;
};
