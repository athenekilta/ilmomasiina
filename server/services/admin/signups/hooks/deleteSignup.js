module.exports = () => (hook) => {
    const models = hook.app.get('models');
    console.log(hook)
    const id = hook.id 
    if (id != 0) {
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
    } else {
        const eventId = hook.params.eventId
        console.log(eventId)
        return models.quota
        .findAll()
        .then((res) => {
            hook.result = res;
            return hook;
        })
        .catch(error => hook);
        
    }
}
    
