import React from 'react';

import moment from 'moment';
import Countdown from 'react-countdown-now';

import { useSingleEventContext } from '../state';
import SignupButton from './SignupButton';

const SignupCountdown = () => {
  const event = useSingleEventContext().event!;
  const openingTime = moment().add(event.millisTillOpening || 0, 'ms').toDate();

  return (
    <Countdown
      daysInHours
      date={openingTime}
      renderer={({ completed, seconds, total }) => (
        <SignupButton
          isOpen={completed && !event.registrationClosed}
          isClosed={event.registrationClosed}
          seconds={seconds}
          total={total}
        />
      )}
    />
  );
};

export default SignupCountdown;
