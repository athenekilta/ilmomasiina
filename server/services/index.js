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
      table.string('name');
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
      name: 'Minuuttikalja 2016',
      date: '2016-4-27 18:00:00',
      description: 'Legendaarinen wappufiiliksen pikakohottaja, Minuuttikalja, on jälleen täällä! Kyseessä on peli, jossa juodaan minuutin välein shotti kaljaa. Sarjoja on perinteiset kaksi: 60 minuutin Power Hour ja 100 minuutin Body Building. Lisäksi janoisammat ja vahvemmat pelaajat voivat jatkaa I Will Go On Forever -sarjaan. Pelata saa myös muilla kaljaan rinnastettavilla juomilla. Oheisviihteenä esitetään jääkiekkospektaakkeli joka, toisin kuin itse Minuuttikalja, tulee päättymään selvin lukemin: MM-finaali vuosimallia -95 tai -11. Viimevuotinen, historian suurin Minuuttikalja, järjestettiin Startup Saunalla, mutta tänä vuonna wapun suurin urheilujuhla tuodaan suoraan Otaniemen sydämeen, Servin Mökkiin! Tapahtuma on ilmainen, mutta vaatii ilmoittautumisen. Ilmo aukeaa keskiviikkona 13.4. klo 12:00 Athenen ilmomasiinassa. Pelit alkavat klo 18:00, olethan viimeistään 17:45 pelipaikoilla! <br /> ************ In English ************ <br /> The legendary Minute Beer is here again! Minute beer is a game in which a player drinks a shot of beer every minute for 60 or 100 minutes, or for as long as he or she can.The event takes place in Smökki, in Otaniemi on Wednesday the 27th of April at 6 PM. The event is free, but a registration is required.', // eslint-disable-line
      price: '',
      location: 'Where: Smökki (Jämeräntaival 4, Espoo)',
      homepage: '',
      facebooklink: 'https://www.facebook.com/events/1715883881987829/',
    }).then(() => {
      debug('created event');
    });

    app.service('/api/events').create({
      name: 'Columbia Road -excu',
      date: '2017-1-11 17:00:00',
      description: 'Columbia Road toivottaa athenelaiset ja tikkiläiset tervetulleeksi exculle 11.1. <br /> Tarkemmat tiedot löytyvät kutsusta linkin takaa. <br />Excupaikkoja on tarjolla 15:lle nopeimmalle athenelaiselle.', //eslint-disable-line
      price: '0',
      location: 'Eerikinkatu 5, Helsinki',
      homepage: 'http://crexcu2017.wordpress.com/',
      facebooklink: '',
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
        quotaName: 'Kiintiö tapahtumalle ',
        quotaSize: 20,
        quotaOpens: '2017-1-1 23:59:59',
        quotaCloses: '2017-1-1 23:59:59',
      });
    },
  });
};
