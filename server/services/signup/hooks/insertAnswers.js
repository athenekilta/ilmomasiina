const _ = require('lodash');

module.exports = () => (hook) => {

  console.log('Inserting answers');
  const signupId = hook.id;
  const answers = hook.data.answers.map(a => _.merge(a, { signupId }));

  return hook.app.get('models').answer.bulkCreate(answers, { updateOnDuplicate: true }).then(() => hook);
};
