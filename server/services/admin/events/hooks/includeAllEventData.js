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
      'webpageUrl',
      'facebookUrl',
      'draft',
      'signupsPublic',
      'verificationEmail',
    ],
    order: [
      [{ model: sequelize.models.quota }, 'sortId', 'ASC'],
      [{ model: sequelize.models.question }, 'sortId', 'ASC'],
    ],
    include: [
      // First include all questions
      {
        attributes: ['id', 'question', 'type', 'options', 'required', 'public', 'sortId'],
        model: sequelize.models.question,
      },
      // Include quotas..
      {
        attributes: ['title', 'size', 'id', 'sortId'],
        model: sequelize.models.quota,
        
        // include: [
        //   {
        //     all: true,
        //     nested: true,
        //   },
        // ],

        // ... and signups of quotas
        include: [
          {
            attributes: ['firstName', 'lastName', 'email', 'createdAt', 'id'],
            model: sequelize.models.signup,
            required: false,
            // ... and answers of signups
            include: [
              {
                required: false,
                attributes: ['questionId', 'answer'],
                model: sequelize.models.answer,
              },
            ],
          },
        ],
      },
    ],
  };
};
