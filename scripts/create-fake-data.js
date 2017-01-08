const debug = require('debug')('app:script');
const knex = require('knex');
const config = require('../config/ilmomasiina.config.js');

const db = knex({
  client: 'mysql',
  connection: {
    user: config.mysqlUser,
    password: config.mysqlPassword,
    database: config.mysqlDatabase,
  },
});

const events = [
  {
    title: 'Minuuttikalja 2016',
    date: '2016-4-27 18:00:00',
    description: 'Legendaarinen wappufiiliksen pikakohottaja, Minuuttikalja',
    price: '',
    location: 'Where: Smökki (Jämeräntaival 4, Espoo)',
    homepage: '',
    facebooklink: 'https://www.facebook.com/events/1715883881987829/',
  },
  {
    title: 'Columbia Road -excu',
    date: '2017-1-11 17:00:00',
    description: 'Columbia Road toivottaa athenelaiset ja tikkiläiset\n\nMonen rivin kuvaus\n\nlorem dorem',
    price: '0 €',
    location: 'Eerikinkatu 5, Helsinki',
    homepage: 'http://crexcu2017.wordpress.com/',
    facebooklink: '',
  },
];

const quotas = [
  {
    eventId: 1,
    title: 'Kiintiö',
    going: 10,
    size: 20,
    signupOpens: '2017-1-11 17:00:00',
    signupCloses: '2017-1-11 17:00:00',
  },
];

const questions = [
  {
    eventId: 1,
    type: 'text',
    question: 'Can you make it?',
    required: true,
    public: false,
  },
];

const signups = [
  {
    quotaId: 1,
    timestamp: '2017-1-11 17:00:00',
    attendee: 'Ville',
    email: 'ville@asd.fi',
  },
];

const answers = [
  {
    questionId: 1,
    signupId: 1,
    answer: 'Wohoo',
  },
];

db('events').insert(events)
  .then(() => db('quotas').insert(quotas))
  .then(() => db('questions').insert(questions))
  .then(() => debug(`${events.length} events with ${quotas.length} quotas and ${questions.length} questions created.`))
  .then(() => db('signups').insert(signups))
  .then(() => db('answers').insert(answers))
  .then(() => debug(`${signups.length} signups with ${answers.length} answers added.`))
  .then(() => db.destroy())
  .then(() => debug('Creating fake data finished.'));
