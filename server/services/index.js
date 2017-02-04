const event = require('./event');
const quota = require('./quota');
const signup = require('./signup');

module.exports = function () {
  const app = this;

  app.configure(event);
  app.configure(quota);
  app.configure(signup);
};
