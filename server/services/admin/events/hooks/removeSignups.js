module.exports = () => (hook) => {
    const models = hook.app.get('models');
    console.log(hook)
};
