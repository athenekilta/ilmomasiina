const includeAssociatedModels = (hook) => {
  if (hook.params.query.$select) return; // if selecting specific columns, do not include

  const sequelize = hook.app.get('sequelize');

  hook.params.sequelize = {
    distinct: true, // must set this in order to get correct total count
    include: [
      {
        model: sequelize.models.quota,
      },
    ],
    // exclude: 'subCategories'
  };
};

exports.before = {
  all: [],
  find: [includeAssociatedModels],
  get: [includeAssociatedModels],
  create: [],
  update: [],
  patch: [],
  remove: [],
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: [],
};
