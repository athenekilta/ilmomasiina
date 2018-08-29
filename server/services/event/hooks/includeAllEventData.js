module.exports = () => (hook) => {
  const sequelize = hook.app.get('sequelize');

  hook.params.sequelize = {
    distinct: true,
    attributes: [
      'id',
      'title',
      'startDate',
      'endDate',
      'registrationStartDate',
      'registrationEndDate',
      'useOpenQuota',
      'openQuotaSize',
      'description',
      'price',
      'location',
      'homepage',
      'webpageUrl',
      'facebookUrl',
      'draft',
      'answersPublic',
      'verificationEmail',
    ],

    include: [
      // First include all questions (also non-public for the form)
      {
        attributes: ['id', 'question', 'type', 'options', 'required', 'public'],
        model: sequelize.models.question,
      },
      // Include quotas..
      {
        attributes: ['title', 'size', 'signupOpens', 'signupCloses', 'id'],
        model: sequelize.models.quota,
        // ... and signups of quotas
        include: [
          {
            attributes: ['firstName', 'lastName', 'createdAt'],
            model: sequelize.models.signup,
            // ... and answers of signups
            include: [
              {
                attributes: ['questionId', 'answer'],
                model: sequelize.models.answer,
                // ... but only public ones
                include: [
                  {
                    model: sequelize.models.question,
                    attributes: [],
                    where: { public: true },
                    required: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };
};
