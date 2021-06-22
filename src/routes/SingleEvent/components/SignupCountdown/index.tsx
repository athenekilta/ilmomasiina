import React from 'react';

import Countdown from 'react-countdown-now';

import { EventGetQuotaItem } from '../../../../api/events';
import { useTypedSelector } from '../../../../store/reducers';
import SignupButton from './SignupButton';

type CountDownProps = {
  openForm: (quotaId: EventGetQuotaItem['id']) => void;
};

const CountDown = (props: CountDownProps) => {
  const { openForm } = props;
  const event = useTypedSelector((state) => state.singleEvent.event);

  return (
    <Countdown
      daysInHours
      date={new Date(new Date().getTime() + (event!.millisTillOpening || 0))}
      renderer={({ completed, seconds, total }) => (
        <SignupButton
          event={event!}
          isOnly={event!.quota.length === 1}
          isOpen={completed && !event!.registrationClosed}
          openForm={openForm}
          seconds={seconds}
          total={total}
        />
      )}
    />
  );
};

export default CountDown;
