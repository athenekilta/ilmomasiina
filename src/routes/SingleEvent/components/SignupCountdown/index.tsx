import React from 'react';

import Countdown from 'react-countdown-now';

import { Quota } from '../../../../api/events';
import { useTypedSelector } from '../../../../store/reducers';
import SignupButton from './SignupButton';

type CountDownProps = {
  beginSignup: (quotaId: Quota.Id) => void;
};

const CountDown = (props: CountDownProps) => {
  const { beginSignup } = props;
  const event = useTypedSelector((state) => state.singleEvent.event)!;

  return (
    <Countdown
      daysInHours
      date={new Date(new Date().getTime() + (event.millisTillOpening || 0))}
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

export default CountDown;
