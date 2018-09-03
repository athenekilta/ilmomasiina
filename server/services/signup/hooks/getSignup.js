module.exports = () => (hook) => {
  const models = hook.app.get('models');
  const id = hook.id;
  const editToken = hook.params.query.editToken;

  // TODO: Verify edit token here!

  return models.signup
    .findOne({
      where: {
        id,
      },
    })
    .then((signup) => {
      hook.result = signup;
      return hook;
    });
};
