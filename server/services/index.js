const event = require('./event');

module.exports = function () {
  const app = this;

  app.configure(event);
};
