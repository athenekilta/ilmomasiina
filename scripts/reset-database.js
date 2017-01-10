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

// Drop tables

db.schema.dropTableIfExists('events')
  .then(() => db.schema.dropTableIfExists('signups'))
  .then(() => db.schema.dropTableIfExists('quotas'))
  .then(() => db.schema.dropTableIfExists('questions'))
  .then(() => db.schema.dropTableIfExists('answers'))
  .then(() => db.schema.dropTableIfExists('attendees'))
  .then(() => debug('Existing tables dropped.'))

  // Create tables
  .then(() =>
    db.schema.createTable('events', (table) => {
      debug('Creating events table...');
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
      debug('Creating signups table...');
      table.increments('id');
      table.integer('quotaId');
      table.dateTime('timestamp');
      table.string('attendee');
      table.string('email');
    }))
  .then(() =>
    db.schema.createTable('quotas', (table) => {
      debug('Creating quotas table...');
      table.increments('id');
      table.integer('eventId');
      table.string('title');
      table.integer('going');
      table.integer('size');
      table.dateTime('signupOpens');
      table.dateTime('signupCloses');
    }))
  .then(() =>
    db.schema.createTable('answers', (table) => {
      debug('Creating answers table...');
      table.increments('id');
      table.integer('signupId');
      table.integer('questionId');
      table.string('answer');
    }))
  .then(() =>
    db.schema.createTable('questions', (table) => {
      debug('Creating questions table...');
      table.increments('id');
      table.integer('eventId');
      table.string('type');
      table.string('question');
      table.string('options');
      table.boolean('required');
      table.boolean('public');
    }))
  .then(() => debug('All tables created.'))

  // Close connection
  .then(() => {
    db.destroy();
  })
  .then(() => debug('Database reset finished.'));
