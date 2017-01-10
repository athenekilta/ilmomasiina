const debug = require('debug')('app:server');
const service = require('feathers-knex');
const hooks = require('feathers-hooks-common');
const knex = require('knex');
const ilmoconfig = require('../../config/ilmomasiina.config.js'); // eslint-disable-line

// const user require('./user');


module.exports = function () { // eslint-disable-line
  debug('Feathers');
  const app = this; // function can't be nameless beacause of this

  // create database connection
  const db = knex({
    client: 'mysql',
    connection: {
      user: ilmoconfig.mysqlUser,
      password: ilmoconfig.mysqlPassword,
      database: ilmoconfig.mysqlDatabase,
    },
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

  app.use('/api/questions', service({
    Model: db,
    name: 'questions',
  }));

  app.use('/api/answers', service({
    Model: db,
    name: 'answers',
  }));

  // Disable external use
  app.service('/api/answers').before({
    all: hooks.disable('external'),
  });
  app.service('/api/questions').before({
    all: hooks.disable('external'),
  });
  app.service('/api/quotas').before({
    all: hooks.disable('external'),
  });
  app.service('/api/signups').before({
    all: hooks.disable('external'),
  });

  // const populateEventsSchema = {
  //   include: [{
  //     service: '/api/quotas',
  //     nameAs: 'quotas',
  //     parentField: 'id',
  //     childField: 'eventId',
  //     asArray: true,
  //   }],
  // };

  const schema = {
    include: [
      {
        service: '/api/quotas',
        nameAs: 'quotas',
        parentField: 'id',
        childField: 'eventId',
        asArray: true,
        include: [
          {
            service: '/api/signups',
            nameAs: 'signups',
            parentField: 'id',
            childField: 'quotaId',
          },
        ],
      },
    ],
  };

  const serializeSchema = {
    only: ['id', 'title', 'date'],
    quotas: {
      only: ['title', 'size', 'signupOpens', 'signupCloses'],
      exclude: 'signups',
      computed: {
        signups: quota => quota.signups.length,
      },
    },
  };

  const populateSingleEvent = {
    include: [{
      service: '/api/quotas',
      nameAs: 'quotas',
      parentField: 'id',
      childField: 'eventId',
      asArray: true,
      include: [{
        service: '/api/signups',
        nameAs: 'signups',
        parentField: 'id',
        childField: 'quotaId',
        include: [{
          service: '/api/answers',
          nameAs: 'answers',
          parentField: 'id',
          childField: 'signupId',
          asArray: true,
        }],
        asArray: true,
      }],
    },
    {
      service: '/api/questions',
      nameAs: 'questions',
      parentField: 'id',
      childField: 'eventId',
    }],
  };

  app.service('/api/events').before({
    // GET /api/events
    // find: [hooks.populate({ schema }), serialize(serializeSchema)],
  });

  // api/events hooks
  app.service('/api/events').after({
    // GET /api/events/<eventId>
    get: hooks.populate({ schema: populateSingleEvent }),
    find: [hooks.populate({ schema }), hooks.serialize(serializeSchema)],
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
