const debug = require('debug')('app:script');
const feathers = require('feathers');
const _ = require('lodash');
const moment = require('moment');
const faker = require('faker');
const axios = require('axios');
const models = require('../server/models');

// Let's create all the times relative to current date, so we can use the same
// script after years
const now = moment().startOf('hour');
// Date format for knex
const d = 'Y-M-D HH:mm:ss';

const events = [
  {
    title: 'Kuormatesti (95 + 50 osallistujaa)',
    date: moment(now).add(3, 'days'),
    registrationStartDate: moment(now).subtract(5, 'days'),
    registrationEndDate: moment(now).add(5, 'days'),
    price: '',
    location: 'Smökki (Jämeräntaival 4, Espoo)',
    draft: 0,
    confirmationMessage: faker.lorem.paragraphs(),
    signupsPublic: 1,
  },
];

const quotas = [
  {
    eventId: 1,
    title: 'Rasittajat 1',
    size: 100,
  },
  {
    eventId: 1,
    title: 'Rasittajat 2',
    size: 50,
  },
];

const questions = [];

const signups = [];

const answers = [];

let signupIndex = 0;

faker.locale = 'pl';

quotas.map((quota, quotaIndex) => {
  for (let i = 0; i < quota.going; i += 1) {
    signups.push({
      quotaId: quotaIndex + 1,
      createdAt: moment().subtract('5', 'minutes'),
      confirmedAt: moment().subtract('1', 'minutes'),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
    });

    signupIndex += 1;
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
seq.models.event
  .bulkCreate(events)
  .then(() => seq.models.quota.bulkCreate(quotas))
  .then(() => seq.models.question.bulkCreate(questions))
  .then(() =>
    console.log(
      `${events.length} events with ${quotas.length} quotas and ${questions.length
      } questions created.`,
    ),
  )
  .then(() => seq.close())
  .then(() => console.log('Creating fake data finished.'))
  .catch(err => console.log(err));

setTimeout(function delay() {
  const apiUrl = 'https://athene.fi/ilmo/api/signups/';
  for (let i = 1; i <= 100; i++) {
    setTimeout(function timer() {
      axios
        .post(apiUrl, { quotaId: 1 })
        .then(function (response) {
          console.log('Got edit token ' + response.data.editToken);
          let postData = {
            answers: [],
            editToken: response.data.editToken,
            email: 'fake@example.com',
            firstName: 'Rasitusgubbe ' + i,
            lastName: faker.name.lastName(),
          };
          axios
            .patch(apiUrl + response.data.id, postData)
            .then(function (response) {
              console.log('Success');
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    }, i * 100);
  }
  for (let i = 1; i <= 45; i++) {
    setTimeout(function timer() {
      axios
        .post(apiUrl, { quotaId: 2 })
        .then(function (response) {
          console.log('Got edit token ' + response.data.editToken);
          let postData = {
            answers: [],
            editToken: response.data.editToken,
            email: 'fake@example.com',
            firstName: 'Rasitusgubbe ' + i,
            lastName: faker.name.lastName(),
          };
          axios
            .patch(apiUrl + response.data.id, postData)
            .then(function (response) {
              console.log('Success');
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(function (error) {
          console.log(error);
        });
    }, i * 100);
  }
}, 1000);

module.exports = app;
