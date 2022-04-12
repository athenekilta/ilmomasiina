const pug = require('pug')

// this is not a proper test file, but should make it easier to check that
// emails are still e.g. rendering
// this will likely just crash when major problems occur

const templateVars = {
  event: {
    title: 'Event title',
    date: '2021',
    location: 'Online',
    verificationEmail: 'this is verification test',
  },
  cancelLink: 'https://athene.fi/ilmo/',
  answers: [],
  branding: {
    footerText: 'This is footer text',
    footerLink: 'https://athene.fi/ilmo?ref=footer-test'
  },
  val: {
    label: '',
    answer: '',
  },
  fields: [],
}

console.log('printing rendered emails (html)...')
const results = {
  confirmation: pug.renderFile('emails/confirmation/html.pug', templateVars),
  newUser: pug.renderFile('emails/newUser/html.pug', templateVars),
  queueMail: pug.renderFile('emails/queueMail/html.pug', templateVars),
}
Object.keys(results).forEach(k => console.log(`${k}:\n`, results[k]))

console.log(
  'each render should be longer than 0 characters:',
  Object.values(results).every(html => html.length > 0)  
)