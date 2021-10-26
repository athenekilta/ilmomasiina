import React from 'react';

import moment from 'moment';
import Countdown from 'react-countdown-now';

import { Quota } from '@tietokilta/ilmomasiina-models/src/services/events';
import { useTypedSelector } from '../../../../store/reducers';
import SignupButton from './SignupButton';

type Props = {
  beginSignup: (quotaId: Quota.Id) => void;
};

const SignupCountdown = (props: Props) => {
  const { beginSignup } = props;
  const event = useTypedSelector((state) => state.singleEvent.event)!;
  const openingTime = moment().add(event.millisTillOpening || 0, 'ms').toDate();

  return (
    <Countdown
      daysInHours
      date={openingTime}
      renderer={({ completed, seconds, total }) => (
        <SignupButton
          isOpen={completed && !event.registrationClosed}
          beginSignup={beginSignup}
          seconds={seconds}
          total={total}
        />
      )}
    />
  );
};

export default SignupCountdown;
