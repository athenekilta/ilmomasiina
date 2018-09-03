module.exports = () => (hook) => {
  const signupId = hook.id;
  const editToken = hook.data.editToken;

  console.log(hook.result);
};
