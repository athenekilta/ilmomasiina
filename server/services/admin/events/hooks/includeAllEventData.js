module.exports = () => hook => {
  const sequelize = hook.app.get('sequelize');

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
      'answersPublic',
      'verificationEmail',
    ],
    include: [
      // First include all questions
      {
        attributes: ['id', 'question', 'type', 'options', 'required', 'public'],
        model: sequelize.models.question,
      },
      // Include quotas..
      {
        attributes: ['title', 'size', 'id'],
        model: sequelize.models.quota,
        include: [
          {
            all: true,
            nested: true,
          },
        ],

        // // ... and signups of quotas
        // include: [
        //   {
        //     attributes: ['firstName', 'lastName', 'createdAt'],
        //     model: sequelize.models.signup,
        //     // ... and answers of signups
        //     include: [
        //       {
        //         attributes: ['questionId', 'answer'],
        //         model: sequelize.models.answer,
        //       },
        //     ],
        //   },
        // ],
      },
    ],
  };
};
