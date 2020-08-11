import moment from 'moment';
import _ from 'lodash';

const signupState = (eventTime, starts, closes) => {
  if (_.isEmpty(starts) || _.isEmpty(closes)) {
    return {
      label: 'Auki toistaiseksi. / Open for now.',
      class: 'signup-opened',
    };
  }

  const signupOpens = moment(starts);
  const signupCloses = moment(closes);
  const eventOpens = moment(eventTime);
  const now = moment();

  const timeFormat = 'D.M.Y [klo] HH:mm';

  if (signupOpens.isSameOrAfter(now)) {
    return {
      label: `Alkaa / Opens ${moment(signupOpens).format(timeFormat)}.`,
      class: 'signup-not-opened',
    };
  }

  if (signupCloses.isSameOrAfter(now)) {
    return {
      label: `Auki / Open until ${moment(signupCloses).format(timeFormat)} asti.`,
      class: 'signup-opened',
    };
  }

  if (eventOpens.isSameOrAfter(now)) {
    return { label: 'Ilmoittautuminen on päättynyt. / Registration has finished', class: 'signup-closed' };
  }

  return { label: 'Tapahtuma on jo päättynyt. / Event has concluded', class: 'event-ended' };
};

export default signupState;
