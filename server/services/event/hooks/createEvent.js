// const _ = require('lodash');

module.exports = () => (hook) => {
  console.log('EVENT', hook.data);
};
