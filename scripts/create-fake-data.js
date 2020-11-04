const debug = require('debug')('app:script');
const feathers = require('feathers');
const _ = require('lodash');
const moment = require('moment');
const faker = require('faker');

const models = require('../server/models');

// Let's create all the times relative to current date, so we can use the same
// script after years
const now = moment().startOf('hour');
// Date format for knex
const d = 'Y-M-D HH:mm:ss';

const events = [
  {
    title: 'Minuuttikalja 2016',
    date: moment(now).subtract(3, 'days'),
    registrationStartDate: moment(now).subtract(10, 'days'),
    registrationEndDate: moment(now).subtract(5, 'days'),
    description: 'Legendaarinen wappufiiliksen pikakohottaja, Minuuttikalja',
    price: '',
    location: 'Smökki (Jämeräntaival 4, Espoo)',
    facebooklink: 'https://www.facebook.com/events/1715883881987829/',
    draft: 0,
    confirmationMessage: faker.lorem.paragraphs(),
    signupsPublic: 1,
  },
  {
    title: 'Columbia Road -excu',
    date: moment(now).add(5, 'days'),
    registrationStartDate: moment(now).add(2, 'days'),
    registrationEndDate: moment(now).add(3, 'days'),
    description:
      'Columbia Road toivottaa athenelaiset ja tikkiläiset\n\nMonen rivin kuvaus\n\nlorem dorem', // eslint-disable-line
    price: '0 €',
    location: 'Eerikinkatu 5, Helsinki',
    webpageUrl: 'http://crexcu2017.wordpress.com/',
    facebooklink: '',
    draft: 0,
    confirmationMessage: faker.lorem.paragraphs(),
    signupsPublic: 1,
  },
  {
    title: 'Ystävänpäiväsitsit',
    date: moment(now).add(15, 'days'),
    registrationStartDate: moment(now).subtract(1, 'days'),
    registrationEndDate: moment(now).add(10, 'days'),
    description: 'Sitsit kiintiöillä + avoimella',
    openQuotaSize: 20,
    price: '14 € (12 € alkoholiton)',
    location: 'Smökki',
    webpageUrl: 'http://crexcu2017.wordpress.com/',
    facebooklink: '',
    draft: 0,
    confirmationMessage: faker.lorem.paragraphs(),
    signupsPublic: 1,
  },
  {
    title: 'Athene Alumni',
    description: 'Lorem ipsum. Lomake kaikilla kentillä.',
    facebooklink: 'https://www.facebook.com/events/1715883881987829/',
    draft: 0,
    confirmationMessage: faker.lorem.paragraphs(),
  },
  {
    title: 'Vanha tapahtuma',
    date: moment(now).add(15, 'days'),
    registrationStartDate: moment(now).subtract(1, 'days'),
    registrationEndDate: moment(now).add(10, 'days'),
    description: 'Tällä voi testata vanhojen tapahtumien automaattista sensurointia. Tämän tapahtuman ilmoittautuneiden nimet ja sähköpostit pitäisi sensuroitua minuutin kuluttua skriptin ajamisesta.',
    facebooklink: 'https://www.facebook.com/events/1715883881987829/',
    draft: 0,
    confirmationMessage: faker.lorem.paragraphs(),
    signupsPublic: 1,
  },
];

const quotas = [
  {
    eventId: 1,
    title: 'Minuuttikalja 2016',
    // going fields doesn't exist in db, but it's used to create right amount of signups
    going: 18,
    size: 20,
  },
  {
    eventId: 2,
    title: 'Athene',
    going: 0,
    size: 20,
  },
  {
    eventId: 2,
    title: 'Tietokilta',
    going: 29,
    size: 20,
  },
  {
    eventId: 3,
    title: 'Athene',
    going: 29,
    size: 20,
  },
  {
    eventId: 3,
    title: 'Prodeko',
    going: 27,
    size: 20,
  },
  {
    eventId: 3,
    title: 'Tietokilta',
    going: 29,
    size: 20,
  },
  {
    eventId: 4,
    title: 'Athene Alumni',
    going: 5,
  },
  {
    eventId: 5,
    title: 'Vanha tapahtuma',
    going: 5,
    old: true,
  },
];

const questions = [
  {
    id: 1,
    eventId: 3,
    type: 'text',
    question: 'Pöytätoive',
    required: true,
    public: false,
  },
  {
    id: 2,
    eventId: 3,
    type: 'text',
    question: 'Valmistumisvuosi',
    required: true,
    public: false,
  },
  {
    id: 3,
    eventId: 3,
    type: 'textarea',
    question: 'Terveiset',
    required: true,
    public: true,
  },
  {
    id: 4,
    eventId: 3,
    type: 'checkbox',
    question: 'Monivalinta',
    options: 'Vaihtoehto 1;Vaihtoehto 2;Vaihtoehto 3',
    required: true,
    public: true,
  },
  {
    id: 5,
    eventId: 3,
    type: 'select',
    question: 'Valintaruudut',
    options: 'Vaihtoehto 1;Vaihtoehto 2;Vaihtoehto 3',
    required: false,
    public: true,
  },
  {
    id: 6,
    eventId: 3,
    type: 'checkbox',
    question: 'Osallistun',
    options: 'Kokkareille;Pääjuhlaan;Sillikselle',
    required: false,
    public: false,
  },
];

const signups = [];

const answers = [];

let signupIndex = 0;

faker.locale = 'en';

const createAnswers = (eventId, signupId) => {
  const questionsToAnswer = _.filter(questions, ['eventId', eventId]) || [];
  if (questionsToAnswer.length > 0) {
    questionsToAnswer.map(
      question =>
        answers.push({
          signupId,
          questionId: question.id,
          answer: faker.lorem.sentence(),
        }), // eslint-disable-line
    );
  }
  return true;
};

quotas.map((quota, quotaIndex) => {
  const createdAt = quota.old ? moment().subtract('6', 'months').add('1', 'minutes') : moment().subtract('5', 'minutes');
  for (let i = 0; i < quota.going; i += 1) {
    signups.push({
      quotaId: quotaIndex + 1,
      createdAt,
      confirmedAt: moment()
        .subtract('1', 'minutes'),
      firstName: i === 0 ? 'Deleted' : faker.name.firstName(),
      lastName: i === 0 ? 'Deleted' : faker.name.lastName(),
      email: faker.internet.email(),
    });

    signupIndex += 1;

    createAnswers(quota.eventId, signupIndex);
  }
  return true;
});

for (let i = 0; i < quotas.length; i += 1) {
  delete quotas[i].going;
}

const app = feathers();
app.configure(models);

const seq = app.get('sequelize');

// Drop tables and create them
seq
  .sync({ force: true })
  .then(() => seq.models.event.bulkCreate(events))
  .then(() => seq.models.quota.bulkCreate(quotas))
  .then(() => seq.models.question.bulkCreate(questions))
  .then(() => debug(`${events.length} events with ${quotas.length} quotas and ${questions.length} questions created.`))
  .then(() => seq.models.signup.bulkCreate(signups))
  .then(() => seq.models.answer.bulkCreate(answers))
  .then(() => debug(`${signups.length} signups with ${answers.length} answers added.`))
  .then(() => seq.close())
  .then(() => debug('Creating fake data finished.'));

module.exports = app;
