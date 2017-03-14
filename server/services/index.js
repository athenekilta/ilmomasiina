const event = require('./event');
const signup = require('./signup');

module.exports = function () {
  const app = this;

  app.configure(event);
  app.configure(signup);
};
