const debug = require('debug')('app:script');
const knex = require('knex');
const _ = require('lodash');
const moment = require('moment');
const config = require('../config/ilmomasiina.config.js');

const db = knex({
  client: 'mysql',
  connection: {
    user: config.mysqlUser,
    password: config.mysqlPassword,
    database: config.mysqlDatabase,
  },
});

// Let's create all the times relative to current date, so we can use the same
// script after years
const now = moment().startOf('hour');
// Date format for knex
const d = 'Y-M-D HH:mm:ss';

const events = [
  {
    title: 'Minuuttikalja 2016',
    date: moment(now).subtract(10, 'days').format(d),
    description: 'Legendaarinen wappufiiliksen pikakohottaja, Minuuttikalja',
    price: '',
    location: 'Smökki (Jämeräntaival 4, Espoo)',
    homepage: '',
    facebooklink: 'https://www.facebook.com/events/1715883881987829/',
  },
  {
    title: 'Columbia Road -excu',
    date: moment(now).add(5, 'days').format(d),
    description: 'Tapahtuma, jossa kiintiöt aukeavat eri aikoihin. Columbia Road toivottaa athenelaiset ja tikkiläiset\n\nMonen rivin kuvaus\n\nlorem dorem', // eslint-disable-line
    price: '0 €',
    location: 'Eerikinkatu 5, Helsinki',
    homepage: 'http://crexcu2017.wordpress.com/',
    facebooklink: '',
  },
  {
    title: 'Ystävänpäiväsitsit',
    date: moment(now).add(15, 'days').format(d),
    description: 'Sitsit kiintiöillä',
    price: '14 € (12 € alkoholiton)',
    location: 'Smökki',
    homepage: 'http://crexcu2017.wordpress.com/',
    facebooklink: '',
  },
  {
    title: 'Athene Alumni',
    description: 'Lorem ipsum. Lomake kaikilla kentillä.',
    facebooklink: 'https://www.facebook.com/events/1715883881987829/',
  },
];

const quotas = [
  {
    eventId: 1,
    title: 'Minuuttikalja 2016',
    // going fields doesn't exist in db, but it's used to create right amount of signups
    going: 18,
    size: 20,
    signupOpens: moment(now).subtract(50, 'days').format(d),
    signupCloses: moment(now).subtract(35, 'days').format(d),
  },
  {
    eventId: 2,
    title: 'Athene',
    going: 0,
    size: 20,
    signupOpens: moment(now).add(2, 'days').format(d),
    signupCloses: moment(now).add(10, 'days').format(d),
  },
  {
    eventId: 2,
    title: 'Tietokilta',
    going: 19,
    size: 20,
    signupOpens: moment(now).add(2, 'days').format(d),
    signupCloses: moment(now).add(5, 'days').format(d),
  },
  {
    eventId: 3,
    title: 'Athene',
    going: 2,
    size: 20,
    signupOpens: moment(now).subtract(2, 'days').format(d),
    signupCloses: moment(now).add(5, 'days').format(d),
  },
  {
    eventId: 3,
    title: 'Prodeko',
    going: 15,
    size: 20,
    signupOpens: moment(now).subtract(2, 'days').format(d),
    signupCloses: moment(now).add(5, 'days').format(d),
  },
  {
    eventId: 3,
    title: 'Tietokilta',
    going: 20,
    size: 20,
    signupOpens: moment(now).subtract(2, 'days').format(d),
    signupCloses: moment(now).add(5, 'days').format(d),
  },
  {
    eventId: 4,
    title: 'Athene Alumni',
    going: 5,
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
    eventId: 4,
    type: 'text',
    question: 'Valmistumisvuosi',
    required: true,
    public: false,
  },
  {
    id: 3,
    eventId: 4,
    type: 'textarea',
    question: 'Terveiset',
    required: true,
    public: true,
  },
  {
    id: 4,
    eventId: 4,
    type: 'select',
    question: 'Monivalinta',
    options: 'Vaihtoehto 1,Vaihtoehto 2,Vaihtoehto 3',
    required: true,
    public: true,
  },
  {
    id: 5,
    eventId: 3,
    type: 'checkbox',
    question: 'Valintaruudut',
    options: 'Vaihtoehto 1,Vaihtoehto 2,Vaihtoehto 3',
    required: false,
    public: true,
  },
];

const signups = [];

const answers = [];

const sampleAttendees = [{name:"Carlos Elliott",email:"celliott0@cyberchimps.com"},{name:"Paula Thompson",email:"pthompson1@archive.org"},{name:"Jason Chavez",email:"jchavez2@ifeng.com"},{name:"Jonathan Campbell",email:"jcampbell3@reference.com"},{name:"Norma Johnston",email:"njohnston4@soup.io"},{name:"Carolyn Smith",email:"csmith5@columbia.edu"},{name:"Tammy Watson",email:"twatson6@gizmodo.com"},{name:"Scott Holmes",email:"sholmes7@nasa.gov"},{name:"Eugene Gilbert",email:"egilbert8@patch.com"},{name:"Dennis Howell",email:"dhowell9@businessweek.com"},{name:"Daniel Cole",email:"dcolea@unc.edu"},{name:"Judy King",email:"jkingb@google.it"},{name:"Joan Graham",email:"jgrahamc@ask.com"},{name:"Stephen Nguyen",email:"snguyend@alexa.com"},{name:"Anne Diaz",email:"adiaze@dell.com"},{name:"Jean Hansen",email:"jhansenf@free.fr"},{name:"Kathy Fields",email:"kfieldsg@list-manage.com"},{name:"Karen Scott",email:"kscotth@imageshack.us"},{name:"Rachel Palmer",email:"rpalmeri@princeton.edu"},{name:"Judy Powell",email:"jpowellj@mac.com"},{name:"Terry Ward",email:"twardk@sciencedaily.com"},{name:"Annie Clark",email:"aclarkl@shinystat.com"},{name:"Martin Hughes",email:"mhughesm@cdc.gov"},{name:"Stephen Carter",email:"scartern@nytimes.com"},{name:"Phyllis Morris",email:"pmorriso@addtoany.com"},{name:"Philip Rose",email:"prosep@tuttocitta.it"},{name:"Fred Parker",email:"fparkerq@xinhuanet.com"},{name:"Craig Kennedy",email:"ckennedyr@pen.io"},{name:"Jane Black",email:"jblacks@blinklist.com"},{name:"Gerald Carpenter",email:"gcarpentert@wikia.com"},{name:"Kenneth Thomas",email:"kthomasu@4shared.com"},{name:"Eugene Brooks",email:"ebrooksv@wordpress.com"},{name:"Deborah Cunningham",email:"dcunninghamw@europa.eu"},{name:"Amy Gray",email:"agrayx@va.gov"},{name:"Jason Bishop",email:"jbishopy@google.it"},{name:"Mark Kelly",email:"mkellyz@ebay.co.uk"},{name:"Sara Reyes",email:"sreyes10@4shared.com"},{name:"Steve Walker",email:"swalker11@ow.ly"},{name:"Shirley Morrison",email:"smorrison12@techcrunch.com"},{name:"Kathy Bradley",email:"kbradley13@yellowpages.com"},{name:"Roy Gutierrez",email:"rgutierrez14@imageshack.us"},{name:"Keith Mendoza",email:"kmendoza15@un.org"},{name:"Ronald Freeman",email:"rfreeman16@histats.com"},{name:"Jonathan James",email:"jjames17@dell.com"},{name:"Denise Kelly",email:"dkelly18@stanford.edu"},{name:"Brenda Gray",email:"bgray19@rambler.ru"},{name:"Daniel Henderson",email:"dhenderson1a@free.fr"},{name:"Nancy Banks",email:"nbanks1b@seesaa.net"},{name:"Janice Lawrence",email:"jlawrence1c@census.gov"},{name:"Nicholas Peterson",email:"npeterson1d@ibm.com"},{name:"Joe Hansen",email:"jhansen1e@imdb.com"},{name:"Joe Taylor",email:"jtaylor1f@samsung.com"},{name:"Mary Nguyen",email:"mnguyen1g@marketwatch.com"},{name:"Henry Jenkins",email:"hjenkins1h@intel.com"},{name:"Mary Lawson",email:"mlawson1i@hubpages.com"},{name:"Barbara Howard",email:"bhoward1j@a8.net"},{name:"Howard Mitchell",email:"hmitchell1k@privacy.gov.au"},{name:"Keith Ruiz",email:"kruiz1l@dedecms.com"},{name:"Harold Ford",email:"hford1m@psu.edu"},{name:"Tammy Bishop",email:"tbishop1n@buzzfeed.com"},{name:"Janice Washington",email:"jwashington1o@paginegialle.it"},{name:"Mary Ramirez",email:"mramirez1p@eepurl.com"},{name:"Robert Pierce",email:"rpierce1q@sitemeter.com"},{name:"Gloria Wright",email:"gwright1r@ycombinator.com"},{name:"Chris Sullivan",email:"csullivan1s@ox.ac.uk"},{name:"Russell Wells",email:"rwells1t@cbslocal.com"},{name:"Ashley Stewart",email:"astewart1u@flickr.com"},{name:"Lisa Riley",email:"lriley1v@hao123.com"},{name:"Teresa Morales",email:"tmorales1w@epa.gov"},{name:"Barbara Jordan",email:"bjordan1x@bandcamp.com"},{name:"Brandon Stevens",email:"bstevens1y@nymag.com"},{name:"Nicholas Moore",email:"nmoore1z@so-net.ne.jp"},{name:"Steve James",email:"sjames20@hexun.com"},{name:"Edward Duncan",email:"eduncan21@parallels.com"},{name:"Sara Lane",email:"slane22@buzzfeed.com"},{name:"Louise Rivera",email:"lrivera23@marketwatch.com"},{name:"Anthony Watson",email:"awatson24@who.int"},{name:"Louise Chavez",email:"lchavez25@cpanel.net"},{name:"Anthony Hanson",email:"ahanson26@bbc.co.uk"},{name:"Anne Gutierrez",email:"agutierrez27@nytimes.com"},{name:"Samuel Hudson",email:"shudson28@instagram.com"},{name:"Lisa Hunt",email:"lhunt29@imageshack.us"},{name:"Adam Gordon",email:"agordon2a@xrea.com"},{name:"Sharon Evans",email:"sevans2b@google.de"},{name:"Donald Howell",email:"dhowell2c@quantcast.com"},{name:"David Fisher",email:"dfisher2d@uol.com.br"},{name:"Amy Lynch",email:"alynch2e@youtube.com"},{name:"Jennifer George",email:"jgeorge2f@people.com.cn"},{name:"George Fox",email:"gfox2g@google.es"},{name:"Mildred Sanders",email:"msanders2h@issuu.com"},{name:"Robin Robertson",email:"rrobertson2i@friendfeed.com"},{name:"Mark Crawford",email:"mcrawford2j@myspace.com"},{name:"Paul Ray",email:"pray2k@linkedin.com"},{name:"Jonathan Shaw",email:"jshaw2l@hubpages.com"},{name:"Mildred Mills",email:"mmills2m@netscape.com"},{name:"Beverly Bradley",email:"bbradley2n@ebay.com"},{name:"Samuel Gutierrez",email:"sgutierrez2o@discuz.net"},{name:"Justin Russell",email:"jrussell2p@mapquest.com"},{name:"Cynthia Berry",email:"cberry2q@apple.com"}]; // eslint-disable-line
const sampleAnswers = ["User-centric even-keeled ability","Diverse asynchronous migration","Enhanced attitude-oriented interface","Virtual directional complexity","Business-focused 24/7 synergy","Streamlined encompassing intranet","Reverse-engineered uniform encryption","Synergistic web-enabled throughput","User-centric web-enabled installation","Mandatory cohesive attitude","Profound human-resource software","Digitized transitional implementation","Extended impactful concept","Cross-platform composite open architecture","Synergized 24/7 matrices","Monitored asymmetric strategy","Vision-oriented scalable function","Inverse foreground forecast","Switchable 5th generation toolset","Phased local focus group","User-centric needs-based benchmark","Distributed mobile matrix","Innovative motivating matrix","Fully-configurable demand-driven matrix","Universal systemic groupware","Expanded bifurcated instruction set","Total human-resource contingency","Organic radical migration","Total non-volatile productivity","Persevering foreground migration","Progressive uniform conglomeration","Diverse tangible software","Enterprise-wide modular protocol","Cross-group intermediate system engine","Stand-alone incremental conglomeration","Monitored exuding architecture","Reverse-engineered human-resource forecast","Pre-emptive systematic projection","Operative zero tolerance data-warehouse","Adaptive object-oriented structure","Compatible user-facing challenge","Cross-platform mobile firmware","Focused local hardware","User-friendly composite encoding","Self-enabling homogeneous knowledge base","Enterprise-wide incremental process improvement","Reverse-engineered fresh-thinking product","Diverse neutral initiative","Focused attitude-oriented conglomeration","Enterprise-wide cohesive flexibility","Right-sized local definition","Quality-focused zero administration system engine","Synchronised dynamic architecture","Operative bifurcated success","Fundamental transitional core","Innovative explicit emulation","Function-based hybrid algorithm","Progressive contextually-based alliance","Seamless neutral alliance","Visionary encompassing array","Open-architected full-range budgetary management","Down-sized context-sensitive neural-net","Pre-emptive dedicated framework","Monitored actuating neural-net","Cross-group scalable adapter","Function-based asymmetric contingency","Object-based 24/7 data-warehouse","User-friendly demand-driven neural-net","User-friendly optimizing parallelism","Virtual needs-based data-warehouse","Expanded mobile archive","Self-enabling holistic customer loyalty","Monitored eco-centric array","Implemented 5th generation forecast","Future-proofed radical productivity","Cloned homogeneous encryption","Automated value-added array","Grass-roots attitude-oriented matrices","Switchable bottom-line success","Balanced logistical complexity","Networked mission-critical instruction set","Horizontal real-time leverage","Customer-focused logistical matrix","Profit-focused modular structure","Organic empowering conglomeration","Managed non-volatile concept","Sharable full-range pricing structure","Optimized heuristic attitude","Upgradable client-driven workforce","Organic fresh-thinking parallelism","Networked bottom-line archive","Self-enabling neutral capacity","Managed systemic help-desk","Balanced modular attitude","User-friendly optimal hierarchy","Customizable high-level encryption","Integrated local knowledge base","Profound full-range instruction set","Adaptive tertiary function","Mandatory human-resource time-frame"]; // eslint-disable-line

let signupIndex = 0;

const createAnswers = (eventId, signupId) => {
  const questionsToAnswer = _.filter(questions, ['eventId', eventId]) || [];
  if (questionsToAnswer.length > 0) {
    questionsToAnswer.map(question =>
      answers.push({
        signupId,
        questionId: question.id,
        answer: _.sample(sampleAnswers),
      }) // eslint-disable-line
    );
  }
  return true;
};

quotas.map((quota, quotaIndex) => {
  for (let i = 0; i < quota.going; i += 1) {
    const attendee = _.sample(sampleAttendees);

    signups.push({
      quotaId: quotaIndex + 1,
      timestamp: moment(now).format(d),
      firstName: attendee.name.split(' ')[0],
      lastName: attendee.name.split(' ')[1],
      email: attendee.email,
    });

    signupIndex += 1;

    createAnswers(quota.eventId, signupIndex);
  }
  return true;
});

for (let i = 0; i < quotas.length; i += 1) {
  delete quotas[i].going;
}

db('events').insert(events)
  .then(() => db('quotas').insert(quotas))
  .then(() => db('questions').insert(questions))
  .then(() => debug(`${events.length} events with ${quotas.length} quotas and ${questions.length} questions created.`))
  .then(() => db('signups').insert(signups))
  .then(() => db('answers').insert(answers))
  .then(() => debug(`${signups.length} signups with ${answers.length} answers added.`))
  .then(() => db.destroy())
  .then(() => debug('Creating fake data finished.'));
