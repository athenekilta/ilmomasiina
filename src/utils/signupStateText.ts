import _ from 'lodash';
import moment from 'moment';

const signupState = (eventTime, starts, closes) => {
  if (_.isEmpty(starts) || _.isEmpty(closes)) {
    return {
      label: 'Auki toistaiseksi.',
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
      label: `Alkaa ${moment(signupOpens).format(timeFormat)}.`,
      class: 'signup-not-opened',
    };
  }

  if (signupCloses.isSameOrAfter(now)) {
    return {
      label: `Auki ${moment(signupCloses).format(timeFormat)} asti.`,
      class: 'signup-opened',
    };
  }

  if (eventOpens.isSameOrAfter(now)) {
    return { label: 'Ilmoittautuminen on päättynyt.', class: 'signup-closed' };
  }

  return { label: 'Tapahtuma on päättynyt.', class: 'event-ended' };
};

export default signupState;
