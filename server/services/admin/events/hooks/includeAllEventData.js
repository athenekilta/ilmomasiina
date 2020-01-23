module.exports = () => hook => {
  const sequelize = hook.app.get('sequelize');

  const { question, quota, signup, answer } = sequelize.models;

  hook.params.sequelize = {
    distinct: true,
    raw: false,
    attributes: [
      'id',
      'title',
      'date',
      'registrationStartDate',
      'registrationEndDate',
      'openQuotaSize',
      'description',
      'price',
      'location',
      'homepage',
      'webpageUrl',
      'facebookUrl',
      'draft',
      'signupsPublic',
      'verificationEmail'
    ],
    include: [
      // First include all questions
      {
        attributes: ['id', 'question', 'type', 'options', 'required', 'public'],
        model: question
      },
      // Include quotas..
      {
        attributes: ['id', 'title', 'size', 'order'],
        model: quota,
        // ... and signups of quotas
        include: {
          attributes: ['firstName', 'lastName', 'email', 'createdAt', 'id'],
          model: signup,
          required: false,
          // ... and answers of signups
          include: {
            required: false,
            attributes: ['questionId', 'answer'],
            model: answer
          }
        }
      }
    ],
    order: [[quota, 'order', 'ASC']]
  };
};
