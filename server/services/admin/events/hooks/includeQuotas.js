module.exports = () => (hook) => {
  hook.params.sequelize = {
    attributes: ['id', 'title', 'date', 'openQuotaSize', 'draft'],
    distinct: true,
  };
};
