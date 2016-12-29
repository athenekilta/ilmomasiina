const debug = require('debug')('app:server');
const service = require('feathers-knex');
const hooks = require('feathers-hooks');
const knex = require('knex');
const ilmoconfig = require('../../config/ilmomasiina.config.js');

// const user require('./user');

module.exports = function () { // 'function' needed as we use 'this'
  debug('Feathers');
  const app = this;

  // initialize db

  // create database connection
  const db = knex({
    client: 'mysql',
    connection: {
      user: ilmoconfig.mysqlUser,
      password: ilmoconfig.mysqlPassword,
      database: ilmoconfig.mysqlDatabase,
    },
  });

  // drop tables
  db.schema.dropTableIfExists('events')
  .then(() => db.schema.dropTableIfExists('attendees'))
  .then(() => db.schema.dropTableIfExists('quotas'))

  // create tables
  .then(() =>
    db.schema.createTable('events', (table) => {
      debug('Creating events table');
      table.increments('id');
      table.string('name');
      table.dateTime('date');
      table.string('description');
      table.string('price');
      table.string('location');
      table.string('homepage');
      table.string('facebooklink');
    }))
  .then(() =>
    db.schema.createTable('attendees', (table) => {
      debug('Creating attendees table');
      table.increments('id');
      table.integer('eventId');
      table.string('name');
      table.string('email');
    }))
  .then(() =>
    db.schema.createTable('quotas', (table) => {
      debug('Creating quotas table');
      table.increments('id');
      table.integer('eventId');
      table.string('quotaName');
      table.integer('quotaSize');
      table.dateTime('quotaOpens');
      table.dateTime('quotaCloses');
    }))
  .then(() => {
    // create dummy events
    app.service('/api/events').create({
      name: 'Tapahtuma1',
      date: '2017-1-1 23:59:59',
      description: 'Hassu tapahtuma',
      price: 'sata euroo',
      location: 'wat',
      homepage: 'ei oo',
      facebooklink: 'ei oo',
    }).then(() => {
      debug('created event');
    });

    app.service('/api/events').create({
      name: 'Tapahtuma2',
      date: '2017-1-1 23:59:59',
      description: 'Hassu tapahtuma',
      price: 'sata euroo',
      location: 'wat',
      homepage: 'ei oo',
      facebooklink: 'ei oo',
    }).then(() => {
      debug('created event');
    });

    // mockup users
    app.service('/api/attendees').create({
      name: 'Joel',
      eventId: 1,
      email: 'joel@ilmo.fi',
    });

    app.service('/api/attendees').create({
      name: 'Pekka',
      eventId: 1,
      email: 'pekka@ilmo.fi',
    });

    app.service('/api/attendees').create({
      name: 'Alan',
      eventId: 2,
      email: 'Alan@ilmo.fi',
    });

    app.service('/api/attendees').create({
      name: 'Ville',
      eventId: 2,
      email: 'ville@ilmo.fi',
    });
  });


  // initialize services
  app.use('/api/events', service({
    Model: db,
    name: 'events',
  }));

  app.use('/api/attendees', service({
    Model: db,
    name: 'attendees',
  }));

  app.use('/api/quotas', service({
    Model: db,
    name: 'quotas',
  }));

  const schema = {
    include: [{
      service: '/api/attendees',
      nameAs: 'attendees',
      parentField: 'id',
      childField: 'eventId',
    },
    {
      service: '/api/quotas',
      nameAs: 'quotas',
      parentField: 'id',
      childField: 'eventId',
    }],
  };

  // hook
  app.service('/api/events').after({
    /* populate get-function result
    with data from attendee and quota tables */
    get: hooks.populate({ schema }),

    create(hook) {
      // creates a new quota and attaches it to just created event
      app.service('/api/quotas').create({
        eventId: hook.result.id,
        quotaName: 'Kiintiö tapahtumalle ',
        quotaSize: 20,
        quotaOpens: '2017-1-1 23:59:59',
        quotaCloses: '2017-1-1 23:59:59',
      });
    },
  });
};
