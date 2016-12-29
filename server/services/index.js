const debug = require('debug')('app:server');
const service = require('feathers-knex');
const hooks = require('feathers-hooks');
const knex = require('knex');
const ilmoconfig = require('../../config/ilmomasiina.config.js'); // eslint-disable-line

// const user require('./user');


module.exports = function () { // eslint-disable-line
  debug('Feathers');
  const app = this; // function can't be nameless beacause of this
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
  .then(() => db.schema.dropTableIfExists('signups'))
  .then(() => db.schema.dropTableIfExists('quotas'))

  // create tables
  .then(() =>
    db.schema.createTable('events', (table) => {
      debug('Creating events table');
      table.increments('id');
      table.string('title');
      table.dateTime('date');
      table.string('description');
      table.string('price');
      table.string('location');
      table.string('homepage');
      table.string('facebooklink');
    }))
  .then(() =>
    db.schema.createTable('signups', (table) => {
      debug('Creating signups table');
      table.increments('id');
      table.integer('quotaId');
      table.dateTime('timestamp');
      table.string('name');
      table.string('email');
    }))
  .then(() =>
    db.schema.createTable('quotas', (table) => {
      debug('Creating quotas table');
      table.increments('id');
      table.integer('eventId');
      table.string('title');
      table.integer('going');
      table.integer('size');
      table.dateTime('signupOpens');
      table.dateTime('signupCloses');
    }))
  .then(() => {
    // create dummy events
    app.service('/api/events').create({
      title: 'Tapahtuma1',
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
      title: 'Tapahtuma2',
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
    app.service('/api/signups').create({
      name: 'Joel',
      eventId: 1,
      email: 'ilmomasiina@gmail.com',
    });

    app.service('/api/signups').create({
      name: 'Pekka',
      eventId: 1,
      email: 'pekka@ilmo.fi',
    });

    app.service('/api/signups').create({
      name: 'Alan',
      eventId: 2,
      email: 'Alan@ilmo.fi',
    });

    app.service('/api/signups').create({
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

  app.use('/api/signups', service({
    Model: db,
    name: 'signups',
  }));

  app.use('/api/quotas', service({
    Model: db,
    name: 'quotas',
  }));

  const populateEventsSchema = {
    include: [{
      service: '/api/quotas',
      nameAs: 'quotas',
      parentField: 'id',
      childField: 'eventId',
      asArray: true,
    }],
  };

  const populateSingleEvent = {
    include: [{
      service: '/api/signups',
      nameAs: 'signups',
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

  // api/events hooks
  app.service('/api/events').after({
    // GET /api/events/<eventId>
    get: hooks.populate({ schema: populateSingleEvent }),
    // GET /api/events
    find: hooks.populate({ schema: populateEventsSchema }),
    create: (hook) => {
      // creates a new quota and attaches it to just created event
      app.service('/api/quotas').create({
        eventId: hook.result.id, // id of the just created event
        title: 'Kiintiö tapahtumalle ',
        size: 20,
        going: 10,
        signupOpens: '2017-1-1 23:59:59',
        signupCloses: '2017-1-1 23:59:59',
      });
    },
  });
};
