module.exports = () => (hook) => {
    const models = hook.app.get('models');
    const id = hook.id;
    console.log(id)
    return models.signup
        .findOne({
            where: {
                id
            },
        })
        .then((res) => {
            hook.result = res;
            return models.signup
                .destroy({
                    where: {
                        id
                    },
                })
                .then((res) => {
                    return hook;
                });
        })
        .catch(error => hook);
};
