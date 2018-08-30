module.exports = () => (hook) => {
  // Hide all signups if answers are not public
  if (!hook.result.dataValues.signupsPublic) {
    if (hook.result.quota) {
      hook.result.dataValues.quota = hook.result.dataValues.quota.map((quota) => {
        if (quota.dataValues.signups) {
          quota.dataValues.signups = null;
        }
        return quota;
      });
    }
  }

  if (hook.result.dataValues.questions && hook.result.dataValues.quota) {
    // IDs of public questions
    const publicQuestions = hook.result.dataValues.questions
      .filter(question => question.public)
      .map(question => question.id);

    // Loop through all quotas and all signups of them
    hook.result.dataValues.quota = hook.result.dataValues.quota.map((quota) => {
      quota.dataValues.signups = quota.dataValues.signups.map((signup) => {
        if (signup.dataValues.answers) {
          // Filter out answers that are not public
          signup.dataValues.answers = signup.dataValues.answers.filter(answer =>
            publicQuestions.includes(answer.questionId),
          );
        }

        return signup;
      });

      return quota;
    });
  }

  return hook;
};
