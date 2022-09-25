module.exports = () => async (hook) => {
  const sequelize = hook.app.get('sequelize');
  const eventModel = hook.app.get('models').event;
  const event = await eventModel.findOne({
    where: { id: hook.data.id }
  })
  // if event was set to private and is not a draft
  const wasPrivate = !event.dataValues.signupsPublic;
  if (hook.data.signupsPublic && wasPrivate && !(hook.data.draft)) {
    // prevent changing the publicity
    throw new Error("Can't change event signups from private to public");
  }
}

