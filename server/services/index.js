const event = require('./event');
const signup = require('./signup');
const user = require('./user');
const authentication = require('./authentication');

module.exports = function () {
  const app = this;

  app.configure(event);
  app.configure(signup);
  app.configure(user);
  app.configure(authentication);
};
