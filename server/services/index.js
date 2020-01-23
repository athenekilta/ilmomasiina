const adminevents = require('./admin/events');
const adminsignups = require('./admin/signups');
const event = require('./event');
const signup = require('./signup');
const user = require('./user');
const authentication = require('./authentication');

module.exports = app => {
  app.configure(authentication);
  app.configure(adminevents);
  app.configure(adminsignups);
  app.configure(event);
  app.configure(signup);
  app.configure(user);
};
