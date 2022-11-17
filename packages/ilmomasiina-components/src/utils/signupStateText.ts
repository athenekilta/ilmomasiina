import moment, { Moment } from 'moment-timezone';

export enum SignupState {
  disabled = 'disabled',
  not_opened = 'not_opened',
  open = 'open',
  closed = 'closed',
}

export type SignupStateInfo =
  | { state: SignupState.disabled }
  | { state: SignupState.not_opened, opens: Moment }
  | { state: SignupState.open, closes: Moment }
  | { state: SignupState.closed };

export function signupState(starts: string | null, closes: string | null): SignupStateInfo {
  if (starts === null || closes === null) {
    return { state: SignupState.disabled };
  }

  const signupOpens = moment(starts);
  const signupCloses = moment(closes);
  const now = moment();

  if (signupOpens.isSameOrAfter(now)) {
    return { state: SignupState.not_opened, opens: signupOpens };
  }

  if (signupCloses.isSameOrAfter(now)) {
    return { state: SignupState.open, closes: signupCloses };
  }

  return { state: SignupState.closed };
}

export interface SignupStateText {
  class: string;
  shortLabel: string;
  fullLabel?: string;
}

export function signupStateText(state: SignupStateInfo): SignupStateText {
  const timeFormat = 'D.M.Y [klo] HH:mm';

  switch (state.state) {
    case SignupState.disabled:
      return {
        shortLabel: 'Tapahtumaan ei voi ilmoittautua.',
        class: 'ilmo--signup-disabled',
      };
    case SignupState.not_opened:
      return {
        shortLabel: `Alkaa ${moment(state.opens).format(timeFormat)}.`,
        fullLabel: `Ilmoittautuminen alkaa ${moment(state.opens).format(timeFormat)}.`,
        class: 'ilmo--signup-not-opened',
      };
    case SignupState.open:
      return {
        shortLabel: `Auki ${moment(state.closes).format(timeFormat)} asti.`,
        fullLabel: `Ilmoittautuminen auki ${moment(state.closes).format(timeFormat)} asti.`,
        class: 'ilmo--signup-opened',
      };
    case SignupState.closed:
      return {
        shortLabel: 'Ilmoittautuminen on päättynyt.',
        class: 'ilmo--signup-closed',
      };
    default:
      throw new Error('invalid state');
  }
}
