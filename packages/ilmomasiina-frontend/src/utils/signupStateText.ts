import moment from 'moment';

const signupState = (starts: string | null, closes: string | null) => {
  if (starts === null || closes === null) {
    return {
      label: 'Tapahtumaan ei voi ilmoittautua.',
      class: 'signup-disabled',
    };
  }

  const signupOpens = moment(starts);
  const signupCloses = moment(closes);
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

  return { label: 'Ilmoittautuminen on päättynyt.', class: 'signup-closed' };
};

export default signupState;
