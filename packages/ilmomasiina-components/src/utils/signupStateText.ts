import moment from 'moment';

export interface SignupState {
  class: string;
  shortLabel: string;
  fullLabel?: string;
}

const signupState = (starts: string | null, closes: string | null) => {
  if (starts === null || closes === null) {
    return {
      shortLabel: 'Tapahtumaan ei voi ilmoittautua.',
      class: 'ilmo--signup-disabled',
    };
  }

  const signupOpens = moment(starts);
  const signupCloses = moment(closes);
  const now = moment();

  const timeFormat = 'D.M.Y [klo] HH:mm';

  if (signupOpens.isSameOrAfter(now)) {
    return {
      shortLabel: `Alkaa ${moment(signupOpens).format(timeFormat)}.`,
      fullLabel: `Ilmoittautuminen alkaa / registration begins: ${moment(signupOpens).format(timeFormat)}.`,
      class: 'ilmo--signup-not-opened',
    };
  }

  if (signupCloses.isSameOrAfter(now)) {
    return {
      shortLabel: `Auki ${moment(signupCloses).format(timeFormat)} asti.`,
      fullLabel: `Ilmoittautuminen auki / registraion is open until ${moment(signupCloses).format(timeFormat)} asti.`,
      class: 'ilmo--signup-opened',
    };
  }

  return { shortLabel: 'Ilmoittautuminen on päättynyt / Registration has closed.', class: 'ilmo--signup-closed' };
};

export default signupState;
