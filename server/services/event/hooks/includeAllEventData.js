module.exports = () => hook => {
  const sequelize = hook.app.get('sequelize');

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
      'webpageUrl',
      'facebookUrl',
      'draft',
      'signupsPublic',
      'verificationEmail',
    ],
    raw: false,
    include: [
      // First include all questions (also non-public for the form)
      {
        attributes: ['id', 'question', 'type', 'options', 'required', 'public'],
        model: sequelize.models.question,
      },
      // Include quotas..
      {
        attributes: ['title', 'size', 'id'],
        model: sequelize.models.quota,
        // ... and signups of quotas
        include: [
          {
            attributes: ['firstName', 'lastName', 'createdAt'],
            model: sequelize.models.signup,
            required: false,
            // ... and answers of signups
            include: [
              {
                attributes: ['questionId', 'answer'],
                model: sequelize.models.answer,
                required: false,
              },
            ],
          },
        ],
      },
    ],
  };
};
