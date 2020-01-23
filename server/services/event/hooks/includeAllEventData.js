module.exports = () => hook => {
  const sequelize = hook.app.get('sequelize');

  const { question, quota, signup, answer } = sequelize.models;

  hook.params.sequelize = {
    distinct: true,
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
    raw: false,
    include: [
      // First include all questions (also non-public for the form)
      {
        attributes: ['id', 'question', 'type', 'options', 'required', 'public'],
        model: question
      },
      // Include quotas..
      {
        attributes: ['id', 'title', 'size', 'order'],
        model: quota,
        // ... and signups of quotas
        include: [
          {
            attributes: ['firstName', 'lastName', 'createdAt'],
            model: signup,
            required: false,
            // ... and answers of signups
            include: [
              {
                attributes: ['questionId', 'answer'],
                model: answer,
                required: false
              }
            ]
          }
        ]
      }
    ],
    order: [[quota, 'order', 'ASC']]
  };
};
