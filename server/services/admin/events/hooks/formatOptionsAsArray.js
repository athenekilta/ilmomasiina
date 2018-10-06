module.exports = () => (hook) => {
  if (hook.result.questions) {
    hook.result.questions.map((question) => {
      if (question.options) {
        question.options = question.options.split(';');
      }
    });
  }
};
